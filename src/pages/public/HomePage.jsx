import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import Layout from '../../components/Layout';
import ProductList from '../../components/ProductList';
import { Separator } from '../../components/ui/separator';
import SEO from '../../components/SEO';
import { getPageSEO, structuredDataTemplates } from '../../config/seo';

function HomePage() {
  const [topCategoryProducts, setTopCategoryProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SEO configuration for home page
  const seoData = getPageSEO('home', { path: '/' });

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        // Popular/top products
        const popular = await productService.getProducts({ limit: 8, sort: 'popularity' });
        const popularItems = (Array.isArray(popular) ? popular : popular.items || []).map(p => ({
          image: p.images?.[0] || p.image,
          name: p.name,
          price: `${p.price} ${p.currency || 'USDT'}`,
          badge: p.badge || undefined,
          outOfStock: !!p.outOfStock,
          _id:p._id
        }));
        setTopCategoryProducts(popularItems);

        // New arrivals
        const newest = await productService.getProducts({ limit: 4, sort: 'newest' });
        const newestItems = (Array.isArray(newest) ? newest : newest.items || []).map(p => ({
          image: p.images?.[0] || p.image,
          name: p.name,
          price: `${p.price} ${p.currency || 'USDT'}`,
          badge: p.badge || undefined,
          outOfStock: !!p.outOfStock,
          _id:p._id

        }));
        setNewArrivals(newestItems);
      } catch (err) {
        console.error('Failed to load home products', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  return (
    <Layout>
      <SEO 
        {...seoData}
        structuredData={[
          structuredDataTemplates.organization,
          structuredDataTemplates.website,
          structuredDataTemplates.ecommerce
        ]}
      />
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

      {/* Sections from backend */}
      <ProductList
        title="Top Categories"
        products={loading || error ? [] : topCategoryProducts}
      />

      <Separator className="  w-[86%] mx-auto h-px top-[83px] left-0 bg-white/10" />

      {/* New Arrivals Section */}
      <ProductList
        title="New Arrivals"
        products={loading || error ? [] : newArrivals}
      />
      {/* Add more <ProductList title="..." products={...} /> as needed */}
    </Layout>
  );
}

export default HomePage;