// // src/types/websocket.ts

// /**
//  * Matches backend: ProductEvent(String event, UUID product_id, Object payload)
//  * Jackson serializes UUID as string, record fields use snake_case via @JsonProperty
//  */
// export interface ProductChangedFields {
//   name?: string;
//   price?: number | string;  // Backend BigDecimal -> number, but handle string just in case
//   description?: string | null;
//   in_stock?: boolean;
//   category_name?: string;
//   category_type?: string;
//   image_url?: string | null;
// }

// export interface ProductEventPayload {
//   changed?: ProductChangedFields;
//   // Future: full product for "product.created", new_price for "product.price.updated", etc.
//   [key: string]: unknown;
// }

// export interface ProductEvent {
//   event: 'product.updated' | 'product.created' | 'product.deleted' | string;
//   product_id: string;  // UUID serialized as string
//   payload: ProductEventPayload;
// }