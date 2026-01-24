import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';

function ProductSpecsEditor({ specs = [], onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newSpec, setNewSpec] = useState({ label: '', value: '' });

  // Common tech spec labels
  const COMMON_LABELS = [
    'Screen Size',
    'Display Resolution',
    'RAM',
    'Storage',
    'Processor',
    'Operating System',
    'Battery Capacity',
    'Camera',
    'Weight',
    'Dimensions',
    'Connectivity',
    'Ports',
    'Color',
    'Material',
    'Warranty',
    'Other'
  ];

  const handleAddSpec = () => {
    if (!newSpec.label || !newSpec.value) {
      alert('Both label and value are required');
      return;
    }

    const spec = {
      label: newSpec.label.trim(),
      value: newSpec.value.trim(),
    };

    const updated = [...specs, spec];
    onChange(updated);
    setNewSpec({ label: '', value: '' });
  };

  const handleUpdateSpec = (index) => {
    if (!editingIndex.spec.label || !editingIndex.spec.value) {
      alert('Both label and value are required');
      return;
    }

    const updated = [...specs];
    updated[index] = {
      label: editingIndex.spec.label.trim(),
      value: editingIndex.spec.value.trim(),
    };
    onChange(updated);
    setEditingIndex(null);
  };

  const handleDeleteSpec = (index) => {
    if (window.confirm('Delete this spec?')) {
      const updated = specs.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  const startEdit = (index) => {
    setEditingIndex({ index, spec: { ...specs[index] } });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-neutralneutral-300 text-sm font-medium">
          Product Specifications
        </label>
        <span className="text-xs text-neutralneutral-400">{specs.length} spec(s)</span>
      </div>

      {/* Existing Specs */}
      {specs.length > 0 && (
        <div className="space-y-2">
          {specs.map((spec, index) => (
            <Card key={index} className="p-3 bg-neutralneutral-800 border-neutralneutral-700">
              {editingIndex?.index === index ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editingIndex.spec.label}
                      onChange={(e) => setEditingIndex({ ...editingIndex, spec: { ...editingIndex.spec, label: e.target.value } })}
                      placeholder="Label (e.g., Screen Size)"
                      className="p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
                      required
                    />
                    <input
                      type="text"
                      value={editingIndex.spec.value}
                      onChange={(e) => setEditingIndex({ ...editingIndex, spec: { ...editingIndex.spec, value: e.target.value } })}
                      placeholder="Value (e.g., 6.1 inches)"
                      className="p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleUpdateSpec(index)}
                      size="sm"
                      className="bg-successs-500 hover:bg-successs-400"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      size="sm"
                      variant="outline"
                      className="border-neutralneutral-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-white font-medium">{spec.label}:</span>
                    <span className="text-neutralneutral-300 ml-2">{spec.value}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => startEdit(index)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-warningw-400 hover:text-warningw-300"
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleDeleteSpec(index)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-dangerd-400 hover:text-dangerd-300"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add New Spec */}
      <Card className="p-4 bg-neutralneutral-800 border-neutralneutral-700 border-dashed">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-neutralneutral-400 text-xs mb-1">Label</label>
              <select
                value={newSpec.label}
                onChange={(e) => setNewSpec({ ...newSpec, label: e.target.value })}
                className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
              >
                <option value="">Select or type custom label</option>
                {COMMON_LABELS.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-neutralneutral-400 text-xs mb-1">Value</label>
              <input
                type="text"
                value={newSpec.value}
                onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                placeholder="Enter value"
                className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
              />
            </div>
          </div>
          {newSpec.label && !COMMON_LABELS.includes(newSpec.label) && (
            <input
              type="text"
              value={newSpec.label}
              onChange={(e) => setNewSpec({ ...newSpec, label: e.target.value })}
              placeholder="Custom label"
              className="w-full p-2 bg-neutralneutral-900 border border-neutralneutral-600 rounded text-white text-sm"
            />
          )}
          <Button
            type="button"
            onClick={handleAddSpec}
            disabled={!newSpec.label || !newSpec.value}
            className="w-full bg-primaryp-500 hover:bg-primaryp-400"
          >
            <Plus size={16} className="mr-2" />
            Add Specification
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ProductSpecsEditor;
