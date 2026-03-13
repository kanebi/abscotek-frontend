export const AppRoutes = {
  home: {
    path: '/',
    name: 'Home',
  },
  // User auth routes
  userLogin: {
    path: '/login',
    name: 'Login',
  },
  userSignup: {
    path: '/signup',
    name: 'Sign Up',
  },
  // Admin auth routes
  adminLogin: {
    path: '/admin/login',
    name: 'Admin Login',
  },
  login: {
    path: '/admin/login',
    name: 'Admin Login',
  },
  signup: {
    path: '/admin/signup',
    name: 'Admin Sign Up',
  },
  admin: {
    path: '/admin',
    name: 'Admin Dashboard',
  },
  vendor: {
    path: '/vendor',
    name: 'Vendor Dashboard',
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
  adminGiveaways: {
    path: '/admin/giveaways',
    name: 'Giveaways',
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
  checkoutSuccess: {
    path: '/checkout/success',
    name: 'Payment successful',
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
  refer: {
    path: '/refer/:id',
    name: 'Referral invite',
  },
  withdrawal: {
    path: '/withdrawal',
    name: 'Withdrawal',
  },
  wishlist: {
    path: '/wishlist',
    name: 'Wishlist',
  },
  search: {
    path: '/search',
    name: 'Search',
  },
  giveaway: {
    path: '/giveaway',
    name: 'Giveaways',
  },
  claimGiveaway: {
    path: '/claim/:giveawayId/:productId',
    name: 'Claim Giveaway',
  },
  // Add more routes here as needed
};
