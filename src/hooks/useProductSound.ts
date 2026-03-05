import { useCallback } from 'react';
import { playSound } from '../utils/sound';
import { toast } from 'sonner';
import { Product, ProductUpdateEvent } from '../types';

export function useProductSounds() {
  // Play sound immediately (called outside state update)
  const playSoundForEvent = useCallback((eventType: string, changes?: Record<string, any>) => {
    switch (eventType) {

      case 'product.added':
        playSound('notification');
        break;


      case 'product.price.updated':
        playSound('price-change');
        break;


      case 'product.updated': {
        if (changes?.price !== undefined) {
          playSound('price-change');
        } else if (changes?.in_stock !== undefined) {
          playSound(changes.in_stock ? 'restock' : 'alert');
        } else if (changes?.name !== undefined) {
          playSound('notification');
        } else {
          playSound('notification');
        }
        break;
      }


      case 'product.image.updated':
        playSound('notification');
        break;


      case 'product.deleted':
        playSound('alert');
        break;


      default:
        playSound('notification');
    }
  }, []);




  // Show toast with product details (called inside state update with prev products)
  const showToastForEvent = useCallback((
    event: ProductUpdateEvent, 
    prevProducts: Product[]
  ) => {
    const { event: eventType, product_id, payload } = event;
    const product = prevProducts.find(p => p.id === product_id);

    switch (eventType) {
      case 'product.added': {
        const newProduct = payload as Product;
        toast.info(`New product added: ${newProduct.name}`, {
          icon: '🆕',
          duration: 3000,
        });
        break;
      }


      case 'product.price.updated': {
        if (product) {
          const newPrice = parseFloat(String(payload.new_price));
          toast.info(
            `Price updated: ${product.name} $${product.price} → $${newPrice}`,
            { icon: '💰', duration: 4000 }
          );
        }
        break;
      }


      case 'product.updated': {
        const changes = payload.changed || {};
        if (!product) break;

        if (changes.price !== undefined) {
          toast.info(`Price updated: ${product.name}`, {
            icon: '💰',
            duration: 3000,
          });
        } else if (changes.in_stock !== undefined) {
          const status = changes.in_stock ? 'back in stock' : 'out of stock';
          toast.info(`${product.name} is ${status}`, {
            icon: changes.in_stock ? '✅' : '⚠️',
            duration: 4000,
          });
        } else if (changes.name !== undefined) {
          toast.info(`Product renamed to: ${changes.name}`, {
            icon: '📝',
            duration: 3000,
          });
        } else {
          toast.info(`${product.name} updated`, {
            icon: '🔄',
            duration: 2000,
          });
        }
        break;
      }

      
      case 'product.image.updated': {
        if (product) {
          toast.info(`Image updated: ${product.name}`, {
            icon: '🖼️',
            duration: 3000,
          });
        }
        break;
      }

    //   case 'product.deleted': {
    //     if (product) {
    //       toast.warning(`Product removed: ${product.name}`, {
    //         icon: '🗑️',
    //         duration: 4000,
    //       });
    //     }
    //     break;
    //   }
    }
  }, []);

  return { playSoundForEvent, showToastForEvent };
}