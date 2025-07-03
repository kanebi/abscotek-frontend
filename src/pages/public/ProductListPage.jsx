import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import AmountCurrency from '../../components/ui/AmountCurrency';
import productService from '../../services/productService';
import { AppRoutes } from '../../config/routes';
import useStore from '../../store/useStore';

function ProductListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useStore();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 12;
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('recommend');

  // Get category from URL params
  const category = searchParams.get('category') || 'Web3 Accessories';

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategories, priceRange, selectedColors, selectedSizes, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category?.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => 
        selectedColors.includes(product.color?.toLowerCase())
      );
    }

    // Apply size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        selectedSizes.includes(product.size?.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order for 'recommend'
        break;
    }

    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / productsPerPage));
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleColorChange = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const categories = [
    { id: 'apples', name: 'Apples' },
    { id: 'samsung', name: 'Samsung' },
    { id: 'huawei', name: 'Huawei' },
    { id: 'tecno', name: 'Tecno' },
    { id: 'infinix', name: 'Infinix' }
  ];

  const colors = [
    { id: 'blue', name: 'Blue', color: 'bg-indigo-600' },
    { id: 'black', name: 'Black', color: 'bg-black' },
    { id: 'red', name: 'Red', color: 'bg-red-500' },
    { id: 'white', name: 'White', color: 'bg-white' },
    { id: 'yellow', name: 'Yellow', color: 'bg-lime-300' }
  ];

  const sizes = [
    { id: '64gb', name: '64GB' },
    { id: '128gb', name: '128GB' },
    { id: '256gb', name: '256GB' }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-neutral-900">
        {/* Breadcrumb */}
        <div className="px-4 md:px-[84px] py-6">
          <div className="flex items-center gap-2 text-gray-200">
            <span 
              className="cursor-pointer hover:text-white font-['Mona_Sans']"
              onClick={() => navigate(AppRoutes.home.path)}
            >
              Home
            </span>
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-200" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
            </div>
            <span className="cursor-pointer hover:text-white font-['Mona_Sans']">Products</span>
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-200" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
            </div>
            <span className="font-['Mona_Sans']">{category}</span>
          </div>
        </div>

        {/* Sort By */}
        <div className="px-4 md:px-[84px] mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-gray-200 text-lg font-normal font-['Mona_Sans']">
              Shopping Options ({filteredProducts.length} Results)
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-white text-base font-medium font-['Mona_Sans']">Sort By</span>
              <div className="p-3.5 rounded-xl outline outline-1 outline-white/50 flex items-center gap-2">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white text-sm font-normal font-['Mona_Sans'] outline-none"
                >
                  <option value="recommend">Recommend</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-2 h-1.5 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 md:px-[84px]">
          <div className="border-t border-neutral-700">
            <div className="flex">
              {/* Filters Sidebar */}
              <div className="w-72 pt-8 pr-8 hidden lg:block">
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-white text-lg font-semibold font-['Mona_Sans']">Category</h3>
                    </div>
                    <div className="space-y-4">
                      {categories.map(category => (
                        <div key={category.id} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={category.id}
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            className="w-5 h-5 rounded border border-zinc-400 bg-transparent"
                          />
                          <label htmlFor={category.id} className="text-gray-200 text-base font-medium font-['Mona_Sans']">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-neutral-700 pt-6">
                    {/* Price Range */}
                    <div className="mb-6">
                      <h3 className="text-white text-lg font-semibold font-['Mona_Sans'] mb-6">Price</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-lg font-semibold font-['Mona_Sans']">
                            ₦{priceRange[0].toLocaleString()}
                          </span>
                          <span className="text-white text-lg font-semibold font-['Mona_Sans']">
                            ₦{priceRange[1].toLocaleString()}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="w-64 h-0 outline outline-[3px] outline-rose-500 mb-4"></div>
                          <div className="flex gap-2">
                            <div className="w-6 h-6 relative">
                              <div className="w-6 h-6 bg-violet-100 rounded-full"></div>
                              <div className="w-4 h-4 absolute top-1 left-1 bg-rose-500 rounded-full"></div>
                            </div>
                            <div className="w-6 h-6 relative">
                              <div className="w-6 h-6 bg-violet-100 rounded-full"></div>
                              <div className="w-4 h-4 absolute top-1 left-1 bg-rose-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-700 pt-6">
                    {/* Colors */}
                    <div className="mb-6">
                      <h3 className="text-white text-lg font-semibold font-['Mona_Sans'] mb-6">Color</h3>
                      <div className="space-y-4">
                        {colors.map(color => (
                          <div key={color.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={color.id}
                                checked={selectedColors.includes(color.id)}
                                onChange={() => handleColorChange(color.id)}
                                className="w-5 h-5 rounded border border-zinc-400 bg-transparent"
                              />
                              <label htmlFor={color.id} className="text-gray-200 text-base font-medium font-['Mona_Sans']">
                                {color.name}
                              </label>
                            </div>
                            <div className={`w-8 h-4 ${color.color} border border-gray-200/30`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-700 pt-6">
                    {/* Sizes */}
                    <div>
                      <h3 className="text-white text-lg font-semibold font-['Mona_Sans'] mb-6">Size</h3>
                      <div className="space-y-4">
                        {sizes.map(size => (
                          <div key={size.id} className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={size.id}
                              checked={selectedSizes.includes(size.id)}
                              onChange={() => handleSizeChange(size.id)}
                              className="w-5 h-5 rounded border border-zinc-400 bg-transparent"
                            />
                            <label htmlFor={size.id} className="text-gray-200 text-base font-medium font-['Mona_Sans']">
                              {size.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="hidden lg:block w-px bg-neutral-700 self-stretch" />

              {/* Products Grid */}
              <div className="flex-1 pt-8 pl-0 lg:pl-8">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-white text-lg font-['Mona_Sans']">Loading products...</div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {getPaginatedProducts().map(product => (
                        <ProductListCard 
                          key={product.id} 
                          product={product}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="w-6 h-6 rotate-180 disabled:opacity-50"
                        >
                          <div className="w-4 h-4 bg-white" style={{ 
                            clipPath: 'polygon(0 0, 100% 50%, 0 100%)' 
                          }} />
                        </button>
                        
                        <div className="flex items-center gap-2">
                          {[...Array(Math.min(3, totalPages))].map((_, index) => {
                            const pageNum = index + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold font-['Mona_Sans'] ${
                                  currentPage === pageNum
                                    ? 'bg-rose-500 text-white'
                                    : 'text-gray-200 hover:text-white'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="w-6 h-6 disabled:opacity-50"
                        >
                          <div className="w-4 h-4 bg-white" style={{ 
                            clipPath: 'polygon(0 0, 100% 50%, 0 100%)' 
                          }} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Product Card Component matching the design
function ProductListCard({ product, onAddToCart }) {
  return (
    <div className="w-72 flex flex-col gap-4">
      <div className="h-64 bg-white rounded-2xl overflow-hidden relative">
        <img 
          src={product.image || 'https://placehold.co/400x300'} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <h3 className="text-white text-lg font-normal font-['Mona_Sans'] leading-snug">
            {product.name}
          </h3>
          <div className="text-white text-lg font-semibold font-['Mona_Sans'] leading-snug">
            <AmountCurrency amount={product.price} fromCurrency="USDT" />
          </div>
        </div>
        <div className="px-7 py-3 bg-rose-500 rounded-xl flex justify-center items-center gap-2.5 cursor-pointer hover:bg-rose-600 transition-colors">
          <button 
            onClick={() => onAddToCart(product)}
            className="text-white text-sm font-medium font-['Mona_Sans'] leading-tight"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductListPage; 