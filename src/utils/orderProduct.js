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
  const priceRaw = product.price ?? item?.unitPrice ?? item?.price ?? 0;
  const price = (typeof priceRaw === 'number' && !Number.isNaN(priceRaw)) ? priceRaw : (Number(priceRaw) || 0);
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
  const priceRaw = product.price ?? product.unitPrice ?? 0;
  const price = (typeof priceRaw === 'number' && !Number.isNaN(priceRaw)) ? priceRaw : (Number(priceRaw) || 0);
  const currency = product.currency ?? order?.currency ?? 'USDC';
  const productId = product.productId ?? product._id ?? null;
  const variant = product.variant ?? null;
  const quantity = product.quantity ?? 1;
  return { name, description, images, imageUrl, price, currency, productId, variant, quantity };
}

/**
 * Normalize order from getOrderById (API) to the shape expected by OrderDetailsSection (profile).
 * Ensures product.currency and product.unitPrice match order currency for correct conversion.
 */
export function normalizeOrderForDetail(order) {
  if (!order) return null;
  const product = order.product || {};
  const firstItem = order.items?.[0];
  const shipping = order.shipping || (order.shippingAddress && {
    name: [order.shippingAddress.firstName, order.shippingAddress.lastName].filter(Boolean).join(' '),
    email: order.shippingAddress.email,
    phone: order.shippingAddress.phoneNumber || order.shippingAddress.areaNumber,
    address: order.shippingAddress.streetAddress,
  }) || {};
  const delivery = order.delivery || (order.deliveryMethod && {
    method: order.deliveryMethod.name,
    timeframe: order.deliveryMethod.estimatedDeliveryTime,
  }) || {};
  return {
    ...order,
    id: order._id || order.id,
    date: order.orderDate || order.createdAt ? new Date(order.orderDate || order.createdAt).toLocaleString() : '',
    number: order.orderNumber || (order._id ? String(order._id).slice(-8).toUpperCase() : '') || order._id,
    currency: order.currency || 'USDC',
    product: (() => {
      const priceRaw = product.price ?? product.unitPrice ?? firstItem?.unitPrice ?? 0;
      const safePrice = (typeof priceRaw === 'number' && !Number.isNaN(priceRaw)) ? priceRaw : (Number(priceRaw) || 0);
      return {
        name: product.name || firstItem?.productName || 'Product',
        variant: product.variant ?? firstItem?.variant?.name ?? null,
        specs: firstItem?.specs ?? product.specs ?? null,
        images: product.images || [],
        quantity: product.quantity ?? firstItem?.quantity ?? 1,
        price: safePrice,
        unitPrice: safePrice,
        currency: order.currency || product.currency || 'USDC',
      };
    })(),
    pricing: order.pricing || {
      subtotal: order.subTotal,
      delivery: order.deliveryFee,
      total: order.totalAmount,
    },
    shipping,
    delivery,
    total: order.totalAmount || order.pricing?.total,
  };
}
