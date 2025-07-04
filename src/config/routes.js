export const AppRoutes = {
  home: {
    path: '/',
    name: 'Home',
  },
  login: {
    path: '/login',
    name: 'Login',
  },
  admin: {
    path: '/admin',
    name: 'Admin Dashboard',
  },
  adminUsers: {
    path: '/admin/users',
    name: 'Manage Users',
  },
  adminProducts: {
    path: '/admin/products',
    name: 'Manage Products',
  },
  adminOrders: {
    path: '/admin/orders',
    name: 'Manage Orders',
  },
  adminCarts: {
    path: '/admin/carts',
    name: 'Manage Carts',
  },
  adminDeliveryMethods: {
    path: '/admin/delivery-methods',
    name: 'Manage Delivery Methods',
  },
  adminWishlist: {
    path: '/admin/wishlist',
    name: 'Manage Wishlist',
  },
  productDetail:{
    path:'/product/:id',
    name: 'Product Detail',
  },
  productList: {
    path: '/products',
    name: 'Products',
  },
  // User-facing pages
  cart: {
    path: '/cart',
    name: 'Shopping Cart',
  },
  checkout: {
    path: '/checkout',
    name: 'Checkout',
  },
  userOrders: {
    path: '/orders',
    name: 'My Orders',
  },
  orderDetails: {
    path: '/orders/:id',
    name: 'Order Details',
  },
  orderSuccess: {
    path: '/order-success/:orderId?',
    name: 'Order Successful',
  },
  userProfile: {
    path: '/profile',
    name: 'User Profile',
  },
  referral: {
    path: '/referral',
    name: 'Referral Program',
  },
  withdrawal: {
    path: '/withdrawal',
    name: 'Withdrawal',
  },
  search: {
    path: '/search',
    name: 'Search',
  },
  // Add more routes here as needed
};
