// SEO Configuration and Constants
export const seoConfig = {
  siteName: 'Abscotek',
  siteUrl: 'https://abscotek.io',
  defaultTitle: 'Abscotek - Premium Tech & Electronics Store',
  defaultDescription: 'Discover premium tech gadgets, smartphones, laptops, and electronics at Abscotek. Stay ahead with the latest technology designed for your lifestyle.',
  defaultKeywords: 'electronics, smartphones, laptops, tech gadgets, iPhone, Samsung, Apple, technology store, USDT payments',
  defaultImage: '/android-chrome-512x512.png',
  twitterHandle: '@abscotek',
  socialMedia: {
    facebook: 'https://facebook.com/abscotek',
    twitter: 'https://twitter.com/abscotek',
    instagram: 'https://instagram.com/abscotek',
  }
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'Abscotek - Premium Tech & Electronics Store',
    description: 'Discover premium tech gadgets, smartphones, laptops, and electronics. Stay ahead with the latest technology designed for your lifestyle. Shop with USDT.',
    keywords: 'electronics store, tech gadgets, smartphones, laptops, iPhone, Samsung, Apple, USDT payments, premium technology',
  },
  products: {
    title: 'Tech Products & Electronics - Abscotek',
    description: 'Browse our extensive collection of premium tech products including smartphones, laptops, tablets, and accessories. Latest models available.',
    keywords: 'tech products, electronics, smartphones, laptops, tablets, accessories, premium technology',
  },
  cart: {
    title: 'Shopping Cart - Abscotek',
    description: 'Review your selected tech products and proceed to secure checkout with USDT payment options.',
    keywords: 'shopping cart, checkout, USDT payment, secure purchase',
    noindex: true,
  },
  checkout: {
    title: 'Secure Checkout - Abscotek',
    description: 'Complete your purchase securely with our encrypted checkout process. USDT payment accepted.',
    keywords: 'secure checkout, USDT payment, encrypted purchase',
    noindex: true,
  },
  profile: {
    title: 'My Account - Abscotek',
    description: 'Manage your account, view order history, and track your purchases.',
    keywords: 'user account, order history, profile management',
    noindex: true,
  },
  orders: {
    title: 'My Orders - Abscotek',
    description: 'View and track your order history and current purchases.',
    keywords: 'order history, order tracking, purchase history',
    noindex: true,
  },
  referral: {
    title: 'Referral Program - Abscotek',
    description: 'Earn rewards by referring friends to Abscotek. Get bonus USDT for successful referrals.',
    keywords: 'referral program, earn rewards, bonus USDT, refer friends',
  },
  search: {
    title: 'Search Results - Abscotek',
    description: 'Find the perfect tech products and electronics that match your needs.',
    keywords: 'search results, find products, tech search, electronics search',
  },
  admin: {
    title: 'Admin Dashboard - Abscotek',
    description: 'Administrative dashboard for managing the Abscotek platform.',
    keywords: 'admin dashboard, platform management',
    noindex: true,
    nofollow: true,
  }
};

// Structured Data Templates
export const structuredDataTemplates = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Abscotek",
    "url": "https://abscotek.io",
    "logo": "https://abscotek.io/android-chrome-512x512.png",
    "description": "Premium tech and electronics store offering smartphones, laptops, and gadgets with USDT payment options.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Global"
    },
    "sameAs": [
      "https://facebook.com/abscotek",
      "https://twitter.com/abscotek",
      "https://instagram.com/abscotek"
    ]
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Abscotek",
    "url": "https://abscotek.io",
    "description": "Premium tech and electronics store",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://abscotek.io/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },

  ecommerce: {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "name": "Abscotek",
    "url": "https://abscotek.io",
    "description": "Premium tech and electronics online store",
    "currenciesAccepted": "USDT",
    "paymentAccepted": "USDT, Cryptocurrency",
    "priceRange": "$50-$5000"
  }
};

// Generate product structured data
export const generateProductStructuredData = (product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description || `${product.name} available at Abscotek`,
  "image": product.image || product.images?.[0],
  "sku": product.id || product.sku,
  "brand": {
    "@type": "Brand",
    "name": product.brand || "Premium"
  },
  "offers": {
    "@type": "Offer",
    "price": product.price?.toString().replace(' USDT', ''),
    "priceCurrency": "USDT",
    "availability": product.outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Abscotek"
    }
  }
});

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `${seoConfig.siteUrl}${item.path}`
  }))
});

// Helper function to get page SEO config
export const getPageSEO = (page, customData = {}) => {
  const baseSEO = pageSEO[page] || {};
  return {
    title: customData.title || baseSEO.title || seoConfig.defaultTitle,
    description: customData.description || baseSEO.description || seoConfig.defaultDescription,
    keywords: customData.keywords || baseSEO.keywords || seoConfig.defaultKeywords,
    image: customData.image || seoConfig.defaultImage,
    noindex: customData.noindex || baseSEO.noindex || false,
    nofollow: customData.nofollow || baseSEO.nofollow || false,
    canonical: customData.canonical || `${seoConfig.siteUrl}${customData.path || ''}`,
    url: customData.url || `${seoConfig.siteUrl}${customData.path || ''}`,
  };
}; 