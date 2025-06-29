import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import Layout from './Layout';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productService.getAllProducts();
        setFeaturedProducts(products.slice(0, 8));
      } catch (error) {
        // Error handled by notification system
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Featured Products</h1>
      {/* {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <li key={product._id} className="bg-white text-neutral-900 rounded shadow p-4">
              <strong>{product.name}</strong>
              <div>{product.description}</div>
              <div className="text-green-600 font-semibold">${product.price}</div>
            </li>
          ))}
        </ul>
      )} */}
      <Link to="/about" className="mt-6 inline-block text-blue-400 hover:underline">Learn more</Link>
    </Layout>
  );
}

export default HomePage;