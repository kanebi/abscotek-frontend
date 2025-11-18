import apiClient from '@/lib/apiClient';
import useStore from '@/store/useStore';
import productService from './productService';

const shouldUseApi = (isAuthenticated, walletAddress) => {
  return isAuthenticated || walletAddress;
};

const getCart = async () => {
  const { isAuthenticated, walletAddress } = useStore.getState();
  if (shouldUseApi(isAuthenticated, walletAddress)) {
    const response = await apiClient.get('/cart');
    return response.data;
  } else {
    return getGuestCart();
  }
};

const addToCart = async (productId, quantity, currency, variantName, isAuthenticated, walletAddress) => {
  if (shouldUseApi(isAuthenticated, walletAddress)) {
    const response = await apiClient.post('/cart', { productId, quantity, currency, variantName });
    return response.data;
  } else {
    const cart = getGuestCart();
    const existingItemIndex = cart.items.findIndex((item) => item.product._id === productId && item.variant?.name === variantName);
    if (existingItemIndex > -1) {
      const newItems = [...cart.items];
      newItems[existingItemIndex].quantity += quantity;
      const newCart = { ...cart, items: newItems };
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    } else {
      const product = await productService.getProduct(productId);
      const variant = product.variants?.find(v => v.name === variantName);
      const newProduct = {
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          images: product.images,
          currency: product.currency,
        },
        variant: variant ? {
          name: variant.name,
          attributes: variant.attributes || [],
          additionalPrice: variant.additionalPrice || 0
        } : null,
        quantity,
      };
      const newItems = [...cart.items, newProduct];
      const newCart = { ...cart, items: newItems };
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    }
  }
};

const updateItemQuantity = async (productId, quantity) => {
  const { isAuthenticated, walletAddress } = useStore.getState();
  if (shouldUseApi(isAuthenticated, walletAddress)) {
    const response = await apiClient.put('/cart', { productId, quantity });
    return response.data;
  } else {
    const cart = getGuestCart();
    const itemIndex = cart.items.findIndex((item) => item.product._id === productId);
    if (itemIndex > -1) {
      const newItems = [...cart.items];
      newItems[itemIndex].quantity = quantity;
      const newCart = { ...cart, items: newItems };
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    }
    return cart;
  }
};

const removeFromCart = async (userId, productId) => {
    const { isAuthenticated, walletAddress } = useStore.getState();
    if (shouldUseApi(isAuthenticated, walletAddress)) {
        const response = await apiClient.delete(`/cart/${userId}/${productId}`);
        return response.data;
    } else {
        let cart = getGuestCart();
        const newItems = cart.items.filter((item) => item.product._id !== productId);
        const newCart = { ...cart, items: newItems };
        localStorage.setItem('guestCart', JSON.stringify(newCart));
        return newCart;
    }
};

const getGuestCart = () => {
  const cart = localStorage.getItem('guestCart');
  if (cart) {
    return JSON.parse(cart);
  } else {
    return { items: [], total: 0, subtotal: 0 };
  }
};

const mergeGuestCart = async () => {
  const guestCart = getGuestCart();
  if (guestCart.items.length > 0) {
    const { isAuthenticated, walletAddress } = useStore.getState();
    const userCurrency = useStore.getState().userCurrency || 'USDT';

    console.log('Merging guest cart with', guestCart.items.length, 'items');

    for (const item of guestCart.items) {
      try {
        console.log('Merging item:', item.product._id, item.quantity);
        await addToCart(item.product._id, item.quantity, userCurrency, item.variant?.name, isAuthenticated, walletAddress);
      } catch (error) {
        console.error('Failed to merge cart item:', item.product._id, error);
      }
    }

    // Clear guest cart after successful merge
    localStorage.removeItem('guestCart');
    console.log('Guest cart merged and cleared');
  }
};

// Admin or owner
const getCartByUserId = async (userId) => {
  const response = await apiClient.get(`/cart/${userId}`);
  return response.data;
};

const clearCart = async () => {
  const response = await apiClient.delete('/cart/clear');
  return response.data;
};

export default {
  getCart,
  addToCart,
  updateItemQuantity,
  removeFromCart,
  getCartByUserId,
  getGuestCart,
  mergeGuestCart,
  clearCart,
};