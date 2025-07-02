import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import Layout from './Layout';
import ProductList from './ProductList';
import { Separator } from './ui/separator';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const fetchProducts = async () => {
    //   try {
    //     const products = await productService.getAllProducts();
    //     setFeaturedProducts(products.slice(0, 8));
    //   } catch (error) {
    //     // Error handled by notification system
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section Desktop */}
      <div className="hidden md:block w-full h-96 relative bg-neutral-800 overflow-hidden">
        <img className="w-full h-[906px] left-0 top-[-336px] absolute object-cover" src="/images/desktop-2.jpg" />
        <div className="w-full h-96 left-0 top-0 absolute">
          <div className="w-full h-96 left-0 top-0 absolute bg-gradient-to-br from-neutral-900/90 via-neutral-900/60 to-transparent" />
        </div>
        <div className="absolute left-[87px] top-[117px] max-w-[465px] flex flex-col gap-3 z-10">
          <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-[48px] font-sans">Stay Ahead with the Latest Tech</h1>
          <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed font-sans">Discover top gadgets, smartphones, and laptops designed to fit your lifestyle.</p>
        </div>
      </div>

      {/* Hero Section Mobile */}
      <div className="self-stretch h-[175px] md:hidden  relative bg-neutral-800 overflow-hidden">
        <img className="w-full h-[175px] left-0  absolute" src="/images/mobile-2.png" />
        <div className="w-full h-[175px]  left-0 top-0 absolute">
          <div className="w-72 h-[175px] bg-gradient-to-br from-neutral-900/90 via-neutral-900/60 to-transparent" />
        </div>
        <div className="w-52 left-[25px] top-[43px] absolute inline-flex flex-col justify-start items-start gap-[3.43px]">
          <div className="self-stretch justify-start text-white text-lg font-bold   leading-snug">Stay Ahead with the Latest Tech</div>
          <div className="self-stretch justify-start text-white text-[10px] font-normal   leading-[15px]">Discover top gadgets, smartphones, and laptops designed to fit your lifestyle.</div>
        </div>
      </div>
      {/* Product List Example (replace with real data) */}
      <ProductList
        title="Top Categories"
        products={[
          {
            image: 'https://placehold.co/538x303',
            name: 'New Apple iPhone 16 Plus ESIM 128GB',
            price: '450.36 USDT',
            badge: 'ESim',
          },
          {
            image: 'https://placehold.co/480x320',
            name: 'New Apple iPhone 16 Plus ESIM 128GB',
            price: '450.36 USDT',
            badge: 'Preowned',
          },
          {
            image: 'https://placehold.co/480x320',
            name: 'New Apple iPhone 16 Plus ESIM 128GB',
            price: '450.36 USDT',
            outOfStock: true,
          },
          {
            image: 'https://placehold.co/465x310',
            name: 'New Apple iPhone 16 Plus ESIM 128GB',
            price: '450.36 USDT',
          },
        ]}
      />

      <Separator className="  w-[86%] mx-auto h-px top-[83px] left-0 bg-white/10" />


      {/* New Arrivals Section */}
      <ProductList
        title="New Arrivals"
        products={[
          {
            image: 'https://placehold.co/540x320',
            name: 'Samsung Galaxy S24 Ultra 256GB',
            price: '999.99 USDT',
            badge: 'New',
          },
          {
            image: 'https://placehold.co/500x300',
            name: 'Dell XPS 13 Laptop 2024',
            price: '1200.00 USDT',
            badge: 'Laptop',
          },
          {
            image: 'https://placehold.co/480x320',
            name: 'Sony WH-1000XM5 Headphones',
            price: '299.99 USDT',
          },
          {
            image: 'https://placehold.co/465x310',
            name: 'Apple Watch Series 9',
            price: '399.00 USDT',
            badge: 'Wearable',
          },
        ]}
      />
      {/* Add more <ProductList title="..." products={...} /> as needed */}
    </Layout>
  );
}

export default HomePage;