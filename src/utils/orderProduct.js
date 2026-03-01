/**
 * Shared helpers for rendering order product data (from productSnapshot or populated product).
 * Use everywhere we display order.product or order.items[].product.
 */
import { ENV } from '@/config/env';

/**
 * Resolve order item image URL: leave full URLs as-is, prepend API origin for backend-relative paths.
 */
export function resolveOrderImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/') && !url.startsWith('/images/')) {
    const base = ENV.API_URL.replace(/\/api\/?$/, '');
    return `${base}${url}`;
  }
  return url;
}

/**
 * Get the first image URL for display (resolved for backend-relative paths).
 */
export function getOrderProductImage(productOrItem) {
  const product = productOrItem?.product ?? productOrItem;
  const images = product?.images ?? (productOrItem?.productImage ? [productOrItem.productImage] : []);
  const first = Array.isArray(images) && images.length > 0 ? images[0] : '/images/desktop-1.png';
  return resolveOrderImageUrl(first);
}

/**
 * Get display fields for an order item (from API item with product/productSnapshot).
 */
export function getOrderItemDisplay(item) {
  const product = item?.product ?? {};
  const name = product.name ?? item?.productName ?? 'Product';
  const description = product.description ?? null;
  const images = product.images ?? (item?.productImage ? [item.productImage] : []);
  const imageUrl = getOrderProductImage(item);
  const price = product.price ?? item?.unitPrice ?? item?.price ?? 0;
  const currency = product.currency ?? item?.currency ?? 'USDC';
  const productId = product._id ?? product.productId ?? item?.product ?? null;
  const variant = product.variant ?? item?.variant?.name ?? item?.variant ?? null;
  const quantity = item?.quantity ?? 1;
  return { name, description, images, imageUrl, price, currency, productId, variant, quantity };
}

/**
 * Get display fields for the flat order.product (first item summary).
 */
export function getOrderProductDisplay(order) {
  const product = order?.product ?? {};
  const name = product.name ?? order?.productName ?? 'Product';
  const description = product.description ?? null;
  const images = product.images ?? [];
  const imageUrl = resolveOrderImageUrl(images?.[0] || order?.productImage || '/images/desktop-1.png');
  const price = product.price ?? product.unitPrice ?? 0;
  const currency = product.currency ?? order?.currency ?? 'USDC';
  const productId = product.productId ?? product._id ?? null;
  const variant = product.variant ?? null;
  const quantity = product.quantity ?? 1;
  return { name, description, images, imageUrl, price, currency, productId, variant, quantity };
}
