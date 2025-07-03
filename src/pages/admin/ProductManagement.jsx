import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { Package, Plus, Edit, Trash2, Search } from 'lucide-react';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchProducts = async () => {
    clearMessages();
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    clearMessages();
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
        setSuccessMessage('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        setErrorMessage('Failed to delete product.');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await productService.createProduct(newProduct);
      setNewProduct({ name: '', description: '', price: '', image: '' });
      fetchProducts();
      setSuccessMessage('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      setErrorMessage('Failed to create product.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await productService.updateProduct(editingProduct._id, editingProduct);
      setEditingProduct(null);
      fetchProducts();
      setSuccessMessage('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('Failed to update product.');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-secondarys-100/10 rounded-full flex items-center justify-center">
              <Package size={24} className="text-secondarys-400" />
            </div>
            <div>
              <h1 className="text-3xl font-heading-header-2-header-2-bold text-white">
                Product Management
              </h1>
              <p className="text-neutralneutral-400">Manage your product catalog</p>
            </div>
          </div>

          {/* Messages */}
          {errorMessage && (
            <Card className="p-4 mb-6 bg-dangerd-100/10 border-dangerd-400">
              <p className="text-dangerd-400">{errorMessage}</p>
            </Card>
          )}
          
          {successMessage && (
            <Card className="p-4 mb-6 bg-successs-100/10 border-successs-400">
              <p className="text-successs-400">{successMessage}</p>
            </Card>
          )}

          {/* Create New Product Form */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Plus size={20} className="text-primaryp-400" />
              <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                Create New Product
              </h2>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (USDT)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  required
                />
              </div>
              
              <textarea
                placeholder="Product Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                rows="3"
              />
              
              <input
                type="url"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
              />
              
              <Button type="submit" className="bg-secondarys-500 hover:bg-secondarys-400">
                <Plus size={16} className="mr-2" />
                Add Product
              </Button>
            </form>
          </Card>

          {/* Edit Product Form */}
          {editingProduct && (
            <Card className="p-6 mb-6 border-warningw-400">
              <div className="flex items-center gap-2 mb-6">
                <Edit size={20} className="text-warningw-400" />
                <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                  Edit Product
                </h2>
              </div>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price (USDT)"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                    required
                  />
                </div>
                
                <textarea
                  placeholder="Product Description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  rows="3"
                />
                
                <input
                  type="url"
                  placeholder="Image URL"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                />
                
                <div className="flex gap-4">
                  <Button type="submit" className="bg-warningw-500 hover:bg-warningw-400">
                    <Edit size={16} className="mr-2" />
                    Update Product
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setEditingProduct(null)}
                    variant="outline"
                    className="border-neutralneutral-600 text-neutralneutral-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Products List */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-heading-header-3-header-3-bold text-white">
                Products ({products.length})
              </h2>
              
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutralneutral-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-neutralneutral-400">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} className="text-neutralneutral-500 mx-auto mb-3" />
                <p className="text-neutralneutral-400">
                  {searchTerm ? 'No products found matching your search.' : 'No products found.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="p-4 bg-neutralneutral-800 rounded-lg">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full md:w-24 h-24 bg-neutralneutral-700 rounded-lg flex-shrink-0">
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-body-large-large-bold text-white mb-1">
                          {product.name}
                        </h3>
                        <p className="text-neutralneutral-300 text-sm mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-primaryp-400 font-body-base-base-bold">
                          <AmountCurrency amount={product.price} fromCurrency="USDT" />
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setEditingProduct(product)}
                          size="sm"
                          className="bg-warningw-500 hover:bg-warningw-400"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(product._id)}
                          size="sm"
                          className="bg-dangerd-500 hover:bg-dangerd-400"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default ProductManagement;