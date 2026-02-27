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

const addToCart = async (productId, quantity, currency, variantName, specs, isAuthenticated, walletAddress) => {
  // Mutual exclusion: if variant is selected, clear specs; if specs are selected, clear variant
  const finalVariantName = variantName || null;
  const finalSpecs = (variantName || !specs || specs.length === 0) ? null : specs;
  
  if (shouldUseApi(isAuthenticated, walletAddress)) {
    const response = await apiClient.post('/cart', { productId, quantity, currency, variantName: finalVariantName, specs: finalSpecs });
    return response.data;
  } else {
    const cart = getGuestCart();
    // Check for existing item with same product, variant, and specs
    const existingItemIndex = cart.items.findIndex((item) => {
      const sameProduct = item.product._id === productId;
      const sameVariant = item.variant?.name === finalVariantName;
      const sameSpecs = JSON.stringify(item.specs || []) === JSON.stringify(finalSpecs || []);
      return sameProduct && sameVariant && sameSpecs;
    });
    if (existingItemIndex > -1) {
      // Update existing item quantity
      const newItems = [...cart.items];
      newItems[existingItemIndex].quantity += quantity;
      
      // Recalculate totals
      const subtotal = newItems.reduce((sum, item) => {
        const price = item.unitPrice || item.product?.price || item.price || 0;
        const variantPrice = item.variant?.additionalPrice || 0;
        return sum + ((price + variantPrice) * item.quantity);
      }, 0);
      
      const newCart = { 
        ...cart, 
        items: newItems,
        subtotal: subtotal,
        total: subtotal,
        currency: cart.currency || finalCurrency || 'USDC'
      };
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    } else {
      const product = await productService.getProduct(productId);
      const variant = product.variants?.find(v => v.name === variantName);
      // Use variant price if available, otherwise use product price
      const finalPrice = variant?.price || product.price;
      const finalCurrency = variant?.currency || product.currency;
      const newProduct = {
        product: {
          _id: product._id,
          name: product.name,
          price: finalPrice,
          images: product.images,
          currency: finalCurrency,
        },
        variant: finalVariantName && variant ? {
          name: variant.name,
          price: variant.price,
          currency: variant.currency,
          attributes: variant.attributes || [],
          additionalPrice: variant.additionalPrice || 0
        } : null,
        specs: finalSpecs || null,
        quantity,
        unitPrice: finalPrice,
        currency: finalCurrency,
      };
      const newItems = [...cart.items, newProduct];
      
      // Recalculate totals
      const subtotal = newItems.reduce((sum, item) => {
        const price = item.unitPrice || item.product?.price || item.price || 0;
        const variantPrice = item.variant?.additionalPrice || 0;
        return sum + ((price + variantPrice) * item.quantity);
      }, 0);
      
      const newCart = { 
        ...cart, 
        items: newItems,
        subtotal: subtotal,
        total: subtotal,
        currency: cart.currency || finalCurrency || 'USDC'
      };
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    }
  }
};

const updateItemQuantity = async (productId, quantity, variantName = null, specs = null) => {
  const { isAuthenticated, walletAddress } = useStore.getState();
  if (shouldUseApi(isAuthenticated, walletAddress)) {
    const response = await apiClient.put('/cart', { productId, quantity, variantName, specs });
    return response.data;
  } else {
    const cart = getGuestCart();
    // Find item by productId, variant, and specs for precise matching
    const itemIndex = cart.items.findIndex((item) => {
      const sameProduct = item.product?._id === productId || item.productId === productId;
      const sameVariant = !variantName && !item.variant?.name || item.variant?.name === variantName;
      const sameSpecs = JSON.stringify(item.specs || []) === JSON.stringify(specs || []);
      return sameProduct && sameVariant && sameSpecs;
    });
    
    if (itemIndex > -1) {
      const newItems = [...cart.items];
      newItems[itemIndex].quantity = quantity;
      
      // Recalculate totals
      const subtotal = newItems.reduce((sum, item) => {
        const price = item.unitPrice || item.product?.price || item.price || 0;
        const variantPrice = item.variant?.additionalPrice || 0;
        return sum + ((price + variantPrice) * item.quantity);
      }, 0);
      
      const newCart = { 
        ...cart, 
        items: newItems,
        subtotal: subtotal,
        total: subtotal,
        currency: cart.currency || 'USDC'
      };
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
        // Filter out the item - handle both productId and variant/spec matching
        const newItems = cart.items.filter((item) => {
            const itemProductId = item.product?._id || item.productId;
            // If productId matches, remove the item
            // Note: For more precise removal, we could also match variant and specs,
            // but for now, removing by productId is sufficient
            return itemProductId !== productId;
        });
        
        // Recalculate totals
        const subtotal = newItems.reduce((sum, item) => {
            const price = item.unitPrice || item.product?.price || item.price || 0;
            const variantPrice = item.variant?.additionalPrice || 0;
            return sum + ((price + variantPrice) * item.quantity);
        }, 0);
        
        const newCart = { 
            ...cart, 
            items: newItems,
            subtotal: subtotal,
            total: subtotal,
            currency: cart.currency || 'USDC'
        };
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
    const userCurrency = useStore.getState().userCurrency || 'USDC';

    for (const item of guestCart.items) {
      try {
        await addToCart(item.product._id, item.quantity, userCurrency, item.variant?.name, item.specs, isAuthenticated, walletAddress);
      } catch (error) {
        // Merge item failed
      }
    }
    localStorage.removeItem('guestCart');
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