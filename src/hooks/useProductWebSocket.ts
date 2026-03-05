import { useEffect, useCallback } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { Product, ProductUpdateEvent } from "../types";
import { applyProductPatch } from "../utils/productUtils";
import { useProductSounds } from "./useProductSound";

const WS_URL = "ws://localhost:8080/ws";

export function useProductWebSocket(
  accessToken: string | undefined,
  onProductUpdate: (updater: (prev: Product[]) => Product[]) => void
) {
  const { playSoundForEvent, showToastForEvent } = useProductSounds();

  const handleMessage = useCallback((msg: IMessage) => {
    const event: ProductUpdateEvent = JSON.parse(msg.body);
    const { event: eventType, payload } = event;
    const changes = payload?.changed;

    // 🔔 Play sound IMMEDIATELY (outside state update)
    playSoundForEvent(eventType, changes);

    // Then update state and show toast with full product details
    onProductUpdate((prev) => {
      // Show toast inside state update so we have access to prev products
      showToastForEvent(event, prev);

      // Apply state changes
      switch (eventType) {
        case "product.added":
          return [...prev, payload as Product];

        case "product.price.updated": {
          const newPrice = parseFloat(String(payload.new_price));
          return prev.map((p) =>
            p.id === (event.product_id ?? event.id ?? event.productId)
              ? { ...p, price: newPrice }
              : p
          );
        }

        case "product.updated":
          return prev.map((p) =>
            p.id === (event.product_id ?? event.id ?? event.productId) 
              ? applyProductPatch(p, payload.changed || {}) 
              : p
          );

        case "product.image.updated":
          return prev.map((p) => 
            p.id === (event.product_id ?? event.id ?? event.productId) 
              ? { ...p, image_url: payload.changed?.image_url } 
              : p
          );

        // case "product.deleted":
        //   return prev.filter(p => p.id !== (event.product_id ?? event.id ?? event.productId));

        default:
          return prev;
      }
    });
  }, [onProductUpdate, playSoundForEvent, showToastForEvent]);

  useEffect(() => {
    if (!accessToken) return;

    let subscription: StompSubscription | null = null;

    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000,
      debug: (msg) => console.log("[WS]", msg),

      onConnect: () => {
        console.log("WebSocket Connected!");
        subscription = client.subscribe("/topic/products", handleMessage);
      },
    });

    client.activate();

    return () => {
      subscription?.unsubscribe();
      client.deactivate();
    };
  }, [accessToken, handleMessage]);
}