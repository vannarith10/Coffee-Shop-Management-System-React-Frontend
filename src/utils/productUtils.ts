import { Product } from "../types";

export function normalizeProduct(p: unknown): Product {
  const raw = p as Record<string, unknown>;
  
  // Helper to handle null/undefined -> string or null
  const toNullableString = (val: unknown): string | null => {
    if (val === null || val === undefined) return null;
    return String(val) || null;
  };

  return {
    id: String(raw.id),
    name: String(raw.name ?? "Unnamed"),
    description: toNullableString(raw.description) ?? "", // null -> "" for description
    price: typeof raw.price === "string" ? parseFloat(raw.price) : (Number(raw.price) ?? 0),
    image_url: toNullableString(raw.image_url ?? raw.imageUrl),
    in_stock: raw.in_stock === null ? null : Boolean(raw.in_stock),
    category_type: String(raw.category_type),
    category_name: String(raw.category_name),
  };
}

export function formatPrice(price: number | undefined): string {
  return typeof price === "number" && Number.isFinite(price)
    ? price.toFixed(2)
    : "—";
}

export function applyProductPatch(product: Product, changed: Partial<Product>): Product {
  return {
    ...product,
    ...(changed.name !== undefined && { name: changed.name }),
    ...(changed.price !== undefined && { price: parseFloat(String(changed.price)) }),
    ...(changed.description !== undefined && { description: changed.description }),
    ...(changed.in_stock !== undefined && { in_stock: changed.in_stock }),
    ...(changed.image_url !== undefined && { image_url: changed.image_url }),
    ...(changed.category_type !== undefined && { category_type: changed.category_type }), // ← ADDED
    ...(changed.category_name !== undefined && { category_name: changed.category_name }),
  };
}