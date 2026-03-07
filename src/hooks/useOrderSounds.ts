//hooks/useOrderSounds.ts

import { useCallback } from "react";
import {Order, OrderUpdateEvent} from "../types/order"
import { playSound } from "../utils/sound";
import { toast } from "sonner";
import { transformOrder } from "../utils/orderHelpers";


export function useOrderSounds () {


    const playSoundForEvent = useCallback((eventType: string) => {
        switch (eventType) {
            case 'new.order':
                playSound('new-order')
                break;

            default:
                playSound("notification");
        }
    }, []);



    const showToastForEvent = useCallback((event: OrderUpdateEvent, prevOrder: Order[]) => {
        const { event: eventType, payload } = event;

        switch (eventType) {
            case 'new.order':
                const newOrder = transformOrder(payload);
                toast.info(`New order #${newOrder.orderNumber} arrived!`, {
                        icon: '🔔',
                        duration: 5000,
                      });
                break;
        }
    }, []);

    return {playSoundForEvent , showToastForEvent}
}