import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import ProductList from '../../components/ProductList';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import SEO from '../../components/SEO';
import { getPageSEO } from '../../config/seo';
import productService from '../../services/productService';
import { Search, Filter, X } from 'lucide-react';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filters
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [limit] = useState(12);

  const seoData = getPageSEO('search', { 
    path: '/search',
    title: `Search Results ${searchQuery ? `for "${searchQuery}"` : ''} - Abscotek`,
    description: `Find the best products ${searchQuery ? `related to "${searchQuery}"` : ''} at Abscotek.`
  });

  useEffect(() => {
    performSearch();
  }, [searchQuery, sortBy, priceRange, category, currentPage]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        q: searchQuery,
        sort: sortBy,
        page: currentPage,
        limit: limit
      };

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        params.minPrice = min;
        if (max) params.maxPrice = max;
      }

      if (category) {
        params.category = category;
      }

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined || params[key] === null) {
          delete params[key];
        }
      });

      const result = await productService.getProducts(params);
      const items = Array.isArray(result) ? result : result.items || [];
      const total = result.total || items.length;

      // Transform products for ProductList component
      const formattedProducts = items.map(p => ({
        _id: p._id,
        image: p.images?.[0] || p.image,
        name: p.name,
        price: `${p.price}`,
        currency: p.currency || 'USDT',
        badge: p.badge || undefined,
        outOfStock: !!p.outOfStock,
        description: p.description
      }));

      setProducts(formattedProducts);
      setTotalCount(total);

      // Update URL params without causing navigation
      const newSearchParams = new URLSearchParams();
      if (searchQuery) newSearchParams.set('q', searchQuery);
      if (sortBy !== 'relevance') newSearchParams.set('sort', sortBy);
      if (priceRange) newSearchParams.set('price', priceRange);
      if (category) newSearchParams.set('category', category);
      if (currentPage > 1) newSearchParams.set('page', currentPage.toString());

      setSearchParams(newSearchParams, { replace: true });
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to load search results. Please try again.');
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    performSearch();
  };

  const handleClearFilters = () => {
    setSortBy('relevance');
    setPriceRange('');
    setCategory('');
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <Layout>
      <SEO {...seoData} />
      <div className="w-[86%] mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Products'}
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutralneutral-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-neutralneutral-800 border-neutralneutral-600 text-white"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`md:block ${showFilters ? 'block' : 'hidden'} space-y-6`}>
            <div className="bg-[#1F1F21] p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-red-400 hover:text-red-300"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-4">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-neutralneutral-300 mb-2">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="bg-neutralneutral-800 border-neutralneutral-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-neutralneutral-300 mb-2">
                    Price Range
                  </label>
                  <Select value={priceRange} onValueChange={handlePriceRangeChange}>
                    <SelectTrigger className="bg-neutralneutral-800 border-neutralneutral-600 text-white">
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Prices</SelectItem>
                      <SelectItem value="0-100">$0 - $100</SelectItem>
                      <SelectItem value="100-500">$100 - $500</SelectItem>
                      <SelectItem value="500-1000">$500 - $1000</SelectItem>
                      <SelectItem value="1000-">$1000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-neutralneutral-300 mb-2">
                    Category
                  </label>
                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="bg-neutralneutral-800 border-neutralneutral-600 text-white">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="smartphones">Smartphones</SelectItem>
                      <SelectItem value="laptops">Laptops</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="md:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-neutralneutral-300">
                {loading ? 'Searching...' : `${totalCount} result${totalCount !== 1 ? 's' : ''} found`}
              </p>
              {totalPages > 1 && (
                <p className="text-neutralneutral-300">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <p className="text-red-400 mb-4">{error}</p>
                <Button onClick={performSearch}>Try Again</Button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-20">
                <p className="text-neutralneutral-300 text-lg mb-4">
                  {searchQuery ? `No results found for "${searchQuery}"` : 'Start searching to find products'}
                </p>
                <p className="text-neutralneutral-400 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            )}

            {/* Results Grid */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard {...product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, currentPage - 2) + i;
                        if (page > totalPages) return null;
                        
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Simple Product Card Component
import ProductCard from '../../components/widgets/ProductCard';

export default SearchPage;
