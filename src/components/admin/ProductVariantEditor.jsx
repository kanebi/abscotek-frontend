import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Plus, X, Trash2, Edit2 } from 'lucide-react';

const COMMON_COLORS = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Orange', value: '#F97316' },
];

// Tech-related sizes for Nigerian market
const COMMON_SIZES = [
  // Storage
  '64GB',
  '128GB',
  '256GB',
  '512GB',
  '1TB',
  '2TB',
  // RAM
  '4GB RAM',
  '6GB RAM',
  '8GB RAM',
  '12GB RAM',
  '16GB RAM',
  '32GB RAM',
  // Screen Sizes
  '5.5 inches',
  '6.1 inches',
  '6.4 inches',
  '6.7 inches',
  '13 inches',
  '14 inches',
  '15.6 inches',
  '17 inches',
  // Other
  'Standard',
  'Large',
  'Extra Large'
];

function ProductVariantEditor({ variants = [], onChange, productPrice = 0 }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newVariant, setNewVariant] = useState({
    name: '',
    price: '',
    currency: 'USDC',
    stock: 0,
    sku: '',
    attributes: [],
    images: [],
  });

  const [newAttribute, setNewAttribute] = useState({
    name: '',
    value: '',
    type: 'custom', // 'color', 'size', 'custom'
  });

  const handleAddVariant = () => {
    // If variant name is empty, ignore and don't save
    if (!newVariant.name || newVariant.name.trim() === '') {
      return;
    }

    // Use product price if variant price is not provided
    const variantPrice = newVariant.price ? Number(newVariant.price) : (productPrice || 0);

    const variant = {
      name: newVariant.name.trim(),
      price: variantPrice,
      currency: newVariant.currency || 'USDC',
      stock: Number(newVariant.stock) || 0,
      sku: newVariant.sku || null,
      attributes: newVariant.attributes || [],
      images: newVariant.images || [],
    };

    const updated = [...variants, variant];
    onChange(updated);
    
    // Reset form
    setNewVariant({
      name: '',
      price: '',
      currency: 'USDC',
      stock: 0,
      sku: '',
      attributes: [],
      images: [],
    });
  };

  const handleUpdateVariant = (index) => {
    // If variant name is empty, ignore and don't save
    if (!editingIndex.variant.name || editingIndex.variant.name.trim() === '') {
      return;
    }

    const updated = [...variants];
    const variant = { ...editingIndex.variant };
    
    // Use product price if variant price is not provided
    if (!variant.price || variant.price === '') {
      variant.price = productPrice || 0;
    } else {
      variant.price = Number(variant.price);
    }
    
    variant.name = variant.name.trim();
    
    updated[index] = variant;
    onChange(updated);
    setEditingIndex(null);
  };

  const handleDeleteVariant = (index) => {
    if (window.confirm('Delete this variant?')) {
      const updated = variants.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  const handleAddAttribute = (variantIndex = null) => {
    if (!newAttribute.name || !newAttribute.value) {
      alert('Attribute name and value are required');
      return;
    }

    const attribute = {
      name: newAttribute.name,
      value: newAttribute.value,
    };

    if (variantIndex !== null) {
      // Adding to existing variant
      const updated = [...variants];
      updated[variantIndex].attributes = [...(updated[variantIndex].attributes || []), attribute];
      onChange(updated);
    } else {
      // Adding to new variant
      setNewVariant({
        ...newVariant,
        attributes: [...(newVariant.attributes || []), attribute],
      });
    }

    setNewAttribute({ name: '', value: '', type: 'custom' });
  };

  const handleQuickAddColor = (color, variantIndex = null) => {
    const attribute = { name: 'Color', value: color.name };
    
    if (variantIndex !== null) {
      const updated = [...variants];
      updated[variantIndex].attributes = [...(updated[variantIndex].attributes || []), attribute];
      onChange(updated);
    } else {
      setNewVariant({
        ...newVariant,
        attributes: [...(newVariant.attributes || []), attribute],
      });
    }
  };

  const handleQuickAddSize = (size, variantIndex = null) => {
    const attribute = { name: 'Size', value: size };
    
    if (variantIndex !== null) {
      const updated = [...variants];
      updated[variantIndex].attributes = [...(updated[variantIndex].attributes || []), attribute];
      onChange(updated);
    } else {
      setNewVariant({
        ...newVariant,
        attributes: [...(newVariant.attributes || []), attribute],
      });
    }
  };

  const handleRemoveAttribute = (variantIndex, attrIndex, isNew = false) => {
    if (isNew) {
      setNewVariant({
        ...newVariant,
        attributes: newVariant.attributes.filter((_, i) => i !== attrIndex),
      });
    } else {
      const updated = [...variants];
      updated[variantIndex].attributes = updated[variantIndex].attributes.filter((_, i) => i !== attrIndex);
      onChange(updated);
    }
  };

  const startEdit = (index) => {
    setEditingIndex({ index, variant: { ...variants[index] } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Product Variants</h3>
        <span className="text-sm text-neutralneutral-400">{variants.length} variant(s)</span>
      </div>

      {/* Existing Variants */}
      {variants.length > 0 && (
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <Card key={index} className="p-4 bg-neutralneutral-800 border-neutralneutral-700">
              {editingIndex?.index === index ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutralneutral-300 text-sm mb-1">Variant Name</label>
                      <input
                        type="text"
                        value={editingIndex.variant.name}
                        onChange={(e) => setEditingIndex({ ...editingIndex, variant: { ...editingIndex.variant, name: e.target.value } })}
                        placeholder="Leave empty to skip"
                        className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-neutralneutral-300 text-sm mb-1">
                        Price (USDC) {productPrice > 0 && <span className="text-xs text-neutralneutral-400">(Default: {productPrice})</span>}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingIndex.variant.price || ''}
                        onChange={(e) => setEditingIndex({ ...editingIndex, variant: { ...editingIndex.variant, price: e.target.value } })}
                        placeholder={productPrice > 0 ? `Default: ${productPrice}` : 'Enter price'}
                        className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutralneutral-300 text-sm mb-1">Stock</label>
                      <input
                        type="number"
                        value={editingIndex.variant.stock || 0}
                        onChange={(e) => setEditingIndex({ ...editingIndex, variant: { ...editingIndex.variant, stock: e.target.value } })}
                        className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-neutralneutral-300 text-sm mb-1">SKU</label>
                      <input
                        type="text"
                        value={editingIndex.variant.sku || ''}
                        onChange={(e) => setEditingIndex({ ...editingIndex, variant: { ...editingIndex.variant, sku: e.target.value } })}
                        className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Attributes for editing */}
                  <div>
                    <label className="block text-neutralneutral-300 text-sm mb-2">Attributes</label>
                    <div className="space-y-2 mb-2">
                      {editingIndex.variant.attributes?.map((attr, attrIdx) => (
                        <div key={attrIdx} className="flex items-center gap-2 p-2 bg-neutralneutral-900 rounded">
                          <span className="text-white text-sm flex-1">
                            <strong>{attr.name}:</strong> {attr.value}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const updated = { ...editingIndex };
                              updated.variant.attributes = updated.variant.attributes.filter((_, i) => i !== attrIdx);
                              setEditingIndex(updated);
                            }}
                            className="h-6 w-6 p-0 text-dangerd-400 hover:text-dangerd-300"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Quick add colors */}
                    <div className="mb-2">
                      <label className="block text-neutralneutral-400 text-xs mb-1">Quick Add Color</label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_COLORS.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => {
                              const updated = { ...editingIndex };
                              updated.variant.attributes = [...(updated.variant.attributes || []), { name: 'Color', value: color.name }];
                              setEditingIndex(updated);
                            }}
                            className="w-8 h-8 rounded border-2 border-neutralneutral-600 hover:border-primaryp-400"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Quick add sizes */}
                    <div className="mb-2">
                      <label className="block text-neutralneutral-400 text-xs mb-1">Quick Add Size</label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_SIZES.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              const updated = { ...editingIndex };
                              updated.variant.attributes = [...(updated.variant.attributes || []), { name: 'Size', value: size }];
                              setEditingIndex(updated);
                            }}
                            className="px-3 py-1 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-xs hover:border-primaryp-400"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Custom attribute */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Attribute name (e.g., Material)"
                        value={newAttribute.name}
                        onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                        className="flex-1 p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={newAttribute.value}
                        onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
                        className="flex-1 p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          if (newAttribute.name && newAttribute.value) {
                            const updated = { ...editingIndex };
                            updated.variant.attributes = [...(updated.variant.attributes || []), { name: newAttribute.name, value: newAttribute.value }];
                            setEditingIndex(updated);
                            setNewAttribute({ name: '', value: '', type: 'custom' });
                          }
                        }}
                        className="bg-primaryp-500 hover:bg-primaryp-400"
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleUpdateVariant(index)}
                      className="bg-successs-500 hover:bg-successs-400"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      variant="outline"
                      className="border-neutralneutral-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{variant.name}</h4>
                      <div className="text-primaryp-400 font-semibold">{variant.price} {variant.currency}</div>
                      <div className="text-neutralneutral-400 text-sm mt-1">
                        Stock: {variant.stock || 0} | SKU: {variant.sku || 'N/A'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => startEdit(index)}
                        className="bg-warningw-500 hover:bg-warningw-400"
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleDeleteVariant(index)}
                        className="bg-dangerd-500 hover:bg-dangerd-400"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {variant.attributes && variant.attributes.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutralneutral-700">
                      <div className="flex flex-wrap gap-2">
                        {variant.attributes.map((attr, attrIdx) => (
                          <div
                            key={attrIdx}
                            className="px-3 py-1 bg-neutralneutral-900 rounded text-white text-sm"
                          >
                            <strong>{attr.name}:</strong> {attr.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add New Variant */}
      <Card className="p-4 bg-neutralneutral-800 border-neutralneutral-700 border-dashed">
        <h4 className="text-white font-medium mb-4">Add New Variant</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutralneutral-300 text-sm mb-1">Variant Name</label>
              <input
                type="text"
                value={newVariant.name}
                onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                placeholder="e.g., Red - Large (leave empty to skip)"
                className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-neutralneutral-300 text-sm mb-1">
                Price (USDC) {productPrice > 0 && <span className="text-xs text-neutralneutral-400">(Default: {productPrice})</span>}
              </label>
              <input
                type="number"
                step="0.01"
                value={newVariant.price}
                onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                placeholder={productPrice > 0 ? `Leave empty to use default: ${productPrice}` : 'Enter price'}
                className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
              />
              {productPrice > 0 && !newVariant.price && (
                <p className="text-xs text-neutralneutral-400 mt-1">Will use product price: {productPrice} USDC</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neutralneutral-300 text-sm mb-1">Stock</label>
              <input
                type="number"
                value={newVariant.stock}
                onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-neutralneutral-300 text-sm mb-1">SKU</label>
              <input
                type="text"
                value={newVariant.sku}
                onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                placeholder="Optional"
                className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
              />
            </div>
          </div>
          
          {/* Attributes */}
          <div>
            <label className="block text-neutralneutral-300 text-sm mb-2">Attributes</label>
            
            {/* Existing attributes */}
            {newVariant.attributes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {newVariant.attributes.map((attr, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-neutralneutral-900 rounded">
                    <span className="text-white text-sm">
                      <strong>{attr.name}:</strong> {attr.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(null, idx, true)}
                      className="text-dangerd-400 hover:text-dangerd-300"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Quick add colors */}
            <div className="mb-3">
              <label className="block text-neutralneutral-400 text-xs mb-1">Quick Add Color</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => handleQuickAddColor(color)}
                    className="w-8 h-8 rounded border-2 border-neutralneutral-600 hover:border-primaryp-400 transition-colors"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            {/* Quick add sizes */}
            <div className="mb-3">
              <label className="block text-neutralneutral-400 text-xs mb-1">Quick Add Size</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleQuickAddSize(size)}
                    className="px-3 py-1 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-xs hover:border-primaryp-400 transition-colors"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom attribute input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Attribute name (e.g., Material, Storage)"
                value={newAttribute.name}
                onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
                className="flex-1 p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
              />
              <input
                type="text"
                placeholder="Value"
                value={newAttribute.value}
                onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
                className="flex-1 p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
              />
              <Button
                type="button"
                onClick={() => handleAddAttribute()}
                className="bg-primaryp-500 hover:bg-primaryp-400"
              >
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <Button
            type="button"
            onClick={handleAddVariant}
            className="w-full bg-primaryp-500 hover:bg-primaryp-400"
          >
            <Plus size={16} className="mr-2" />
            Add Variant
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ProductVariantEditor;
