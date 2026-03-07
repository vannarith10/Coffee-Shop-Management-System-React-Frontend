//hooks/useOrderWebSocket.ts
import { useEffect, useCallback } from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import { Order , OrderUpdateEvent } from "../types/order"
import {useOrderSounds} from "./useOrderSounds";
import { transformOrder } from "../utils/orderHelpers";
import { APIOrder } from "../types/order";


const WS_URL = "ws://localhost:8080/ws";

export function useOrderWebSocket (
    accessToken: string | undefined,
    onOrderUpdate: (updater: (prev: Order[]) => Order[]) => void
) {
    const { showToastForEvent } = useOrderSounds();

    const handleMessage = useCallback((msg : IMessage) => {
        const event : OrderUpdateEvent = JSON.parse(msg.body);
        const {event: eventType, payload} = event;
        
        
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
    }, [onOrderUpdate, showToastForEvent]);


    useEffect(() => {
        if (!accessToken) return;

        let subscribe : StompSubscription | null = null;           

        const client = new Client({
            brokerURL: WS_URL,
            connectHeaders: {Authorization: `Bearer ${accessToken}`},
            reconnectDelay: 5000,
            debug: (msg) => console.log("WebSocket Message: ", msg),

            onConnect: () => {
                console.log("WebSocket Connected!");
                subscribe = client.subscribe("/topic/barista", handleMessage);
            },
        });

        client.activate();

        return () => {
            subscribe?.unsubscribe();
            client.deactivate();
        };
    }, [accessToken, handleMessage]);

}