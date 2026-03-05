import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAccessToken } from './authService';
import { ProductEvent } from '../types/websocket';

type EventHandler = (event: ProductEvent) => void;
type ConnectionHandler = (connected: boolean) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private eventHandlers: Set<EventHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  async connect(): Promise<void> {
    if (this.client?.active) return;

    return new Promise((resolve, reject) => {
      const token = getAccessToken();
      
      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.notifyConnectionChange(true);
          this.subscribeToProducts();
          resolve();
        },

        onStompError: (frame) => {
          console.error('STOMP error:', frame.headers['message']);
          reject(new Error(frame.headers['message']));
        },

        onWebSocketError: () => {
          this.handleReconnect();
        },

        onDisconnect: () => {
          this.notifyConnectionChange(false);
        },
      });
      this.client.activate();
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private subscribeToProducts() {
    if (!this.client?.connected) return;

    const sub = this.client.subscribe('/topic/products', (message: IMessage) => {
      try {
        const event: ProductEvent = JSON.parse(message.body);
        console.log('WS Received:', event.event, event.product_id, event.payload);
        this.eventHandlers.forEach(handler => handler(event));
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    this.subscriptions.set('/topic/products', sub);
  }

  onProductUpdate(handler: EventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }

  onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  private notifyConnectionChange(connected: boolean) {
    this.connectionHandlers.forEach(h => h(connected));
  }

  disconnect(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
    this.eventHandlers.clear();
    this.connectionHandlers.clear();
    this.client?.deactivate();
    this.client = null;
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

export const wsService = new WebSocketService();