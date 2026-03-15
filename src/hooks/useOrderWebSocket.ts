//hooks/useOrderWebSocket.ts
import { useEffect, useCallback } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { Order, OrderUpdateEvent } from "../types/order";
import { useOrderSounds } from "./useOrderSounds";
import { transformOrder } from "../utils/orderHelpers";
import { APIOrder } from "../types/order";
import {
  MetricsEventEnvelope,
  PerformanceMetricsPayload,
} from "@/types/metrics";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";

export function useOrderWebSocket(
  accessToken: string | undefined,
  onOrderUpdate: (updater: (prev: Order[]) => Order[]) => void,
  onMetricsUpdate?: (payload: PerformanceMetricsPayload) => void,
) {
  const { showToastForEvent } = useOrderSounds();

  const handleOrderMessage = useCallback(
    (msg: IMessage) => {
      const event: OrderUpdateEvent = JSON.parse(msg.body);
      const { event: eventType, payload } = event;

      onOrderUpdate((prev) => {
        showToastForEvent(event, prev);

        switch (eventType) {
          case "new.order":
            const transformOrders = transformOrder(payload as APIOrder);
            return [...prev, transformOrders];

          default:
            return prev;
        }
      });
    },
    [onOrderUpdate, showToastForEvent],
  );

  // Handle Performance Metrics real-time update
  const handleMetricsMessage = useCallback(
    (msg: IMessage) => {
      if (!onMetricsUpdate) return;

      try {
        const envelope: MetricsEventEnvelope = JSON.parse(msg.body);
        if (
          envelope?.event === "performance.metrics.updated" &&
          envelope?.payload
        ) {
          onMetricsUpdate(envelope.payload);
        }
      } catch {
        // Ignore malformed frames
      }
    },
    [onMetricsUpdate],
  );

  useEffect(() => {
    if (!accessToken) return;

    let subOrders: StompSubscription | null = null;
    let subMetrics: StompSubscription | null = null;

    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000,
      debug: (msg) => console.log("[WebSocket Message] ", msg),

      onConnect: () => {
        console.log("WebSocket Connected!");

        subOrders = client.subscribe("/topic/barista", handleOrderMessage);
        subMetrics = client.subscribe(
          "/topic/barista-dashboard/metrics",
          handleMetricsMessage,
        );
      },
    });

    client.activate();

    return () => {
      subOrders?.unsubscribe();
      subMetrics?.unsubscribe();
      client.deactivate();
    };
  }, [accessToken, handleOrderMessage, handleMetricsMessage]);
}
