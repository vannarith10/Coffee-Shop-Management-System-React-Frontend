export type BackendError = {
  message: string;
  status: number;
  timestamp: string;
  detail: string;
};

export function toBackendError(err: unknown): BackendError {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    return {
      message: String(e.message ?? "Unknown error"),
      status: Number(e.status ?? 500),
      timestamp: String(e.timestamp ?? new Date().toISOString()),
      detail: String(e.detail ?? "No details available"),
    };
  }
  return {
    message: "Unknown error",
    status: 500,
    timestamp: new Date().toISOString(),
    detail: String(err),
  };
}


export type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  description?: string;
  category_type: string; // DRINK and FOOD
  category_name?: string; // TEA, COFFEE, NOODLE
  in_stock: boolean | null;
  // If we don't use NULL it means it is required
};


export type ProductUpdateEvent = {
  event: "product.price.updated" | "product.updated" | "product.added" | "product.image.updated";
  product_id?: string;
  id?: string;
  productId?: string;
  payload: {
    new_price?: number;
    changed?: Partial<Product>;
  };
};


export type UserRole = "ADMIN" | "CASHIER" | "BARISTA";


export interface User {
  id: string;
  username: string;
  role: UserRole;
}
