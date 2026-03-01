import { useEffect, useCallback } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { Product, ProductUpdateEvent } from "../types";
import { applyProductPatch } from "../utils/productUtils";

const WS_URL = "ws://localhost:8080/ws";

export function useProductWebSocket(
  accessToken: string | undefined,
  onProductUpdate: (updater: (prev: Product[]) => Product[]) => void
) {
  const handleMessage = useCallback((msg: IMessage) => {
    const event: ProductUpdateEvent = JSON.parse(msg.body);
    const productId = event.product_id ?? event.id ?? event.productId;
    const payload = event.payload;

    onProductUpdate((prev) => {
      switch (event.event) {

        case "product.added":
          return [...prev, payload as Product];

        case "product.price.updated":
          return prev.map((p) =>
            p.id === productId
              ? { ...p, price: parseFloat(String(payload.new_price)) }
              : p
          );

        case "product.updated":
          return prev.map((p) =>
            p.id === productId ? applyProductPatch(p, payload.changed || {}) : p
          );

        case "product.image.updated":
          return prev.map((p) => p.id === productId ? {...p, image_url: payload.changed?.image_url} : p);

        default:
          return prev;
      }
    });
  }, [onProductUpdate]);

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