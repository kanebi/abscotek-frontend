import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      <ErrorMessage message={errorMessage} />
      <SuccessMessage message={successMessage} />

      {/* Create New Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Create New Product</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          ></textarea>
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Add Product
          </button>
        </form>
      </div>

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <textarea
              placeholder="Description"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            ></textarea>
            <input
              type="number"
              placeholder="Price"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input
              type="text"
              placeholder="Image URL"
              value={editingProduct.image}
              onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2">
              Update Product
            </button>
            <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400">
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Existing Products</h3>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">{product.description}</td>
                  <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProductManagement;