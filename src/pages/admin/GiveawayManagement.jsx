import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import productService from '../../services/productService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Gift, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { AppRoutes } from '../../config/routes';

const defaultItem = () => ({
  productId: '',
  name: '',
  couponCodes: [],
  walletAddresses: [],
  paidDeliveryByUser: true,
  claimType: 'immediate',
  claimWindowStart: '',
  claimWindowEnd: '',
});

function GiveawayManagement() {
  const navigate = useNavigate();
  const [giveaways, setGiveaways] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    expiresAt: '',
    items: [defaultItem()],
  });
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGiveaways();
    productService.getAdminProducts({ limit: 500 }).then((data) => {
      const list = Array.isArray(data) ? data : data?.items || [];
      setProducts(list);
    }).catch(() => {});
  }, []);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const fetchGiveaways = async () => {
    clearMessages();
    setLoading(true);
    try {
      const data = await adminService.getGiveaways();
      setGiveaways(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage('Failed to fetch giveaways.');
      setGiveaways([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setForm((f) => ({ ...f, items: [...f.items, defaultItem()] }));
  };

  const removeItem = (index) => {
    setForm((f) => ({
      ...f,
      items: f.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index, field, value) => {
    setForm((f) => {
      const next = [...f.items];
      if (field === 'couponCodes') {
        next[index] = { ...next[index], couponCodes: value.split(/[\n,]/).map((s) => s.trim()).filter(Boolean) };
      } else if (field === 'walletAddresses') {
        next[index] = { ...next[index], walletAddresses: value.split(/[\n,]/).map((s) => s.trim()).filter(Boolean) };
      } else {
        next[index] = { ...next[index], [field]: value };
      }
      return { ...f, items: next };
    });
  };

  const handleDelete = async (id) => {
    clearMessages();
    if (!window.confirm('Delete this giveaway?')) return;
    try {
      await adminService.deleteGiveaway(id);
      fetchGiveaways();
      setSuccessMessage('Giveaway deleted.');
      if (editingId === id) {
        setEditingId(null);
        setForm({ name: '', expiresAt: '', items: [defaultItem()] });
      }
    } catch (error) {
      setErrorMessage('Failed to delete giveaway.');
    }
  };

  const formatDateTimeLocal = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleEdit = async (id) => {
    clearMessages();
    try {
      const g = await adminService.getGiveawayById(id);
      if (!g) {
        setErrorMessage('Giveaway not found.');
        return;
      }
      const items = (g.items || []).map((it) => {
        const productId = it.product ? (it.product._id || it.product).toString() : '';
        return {
          productId,
          name: it.name || '',
          couponCodes: Array.isArray(it.couponCodes) ? it.couponCodes : [],
          walletAddresses: Array.isArray(it.walletAddresses) ? it.walletAddresses : [],
          paidDeliveryByUser: it.paidDeliveryByUser !== false,
          claimType: it.claimType || 'immediate',
          claimWindowStart: it.claimWindowStart ? formatDateTimeLocal(it.claimWindowStart) : '',
          claimWindowEnd: it.claimWindowEnd ? formatDateTimeLocal(it.claimWindowEnd) : '',
        };
      });
      setForm({
        name: g.name || '',
        expiresAt: formatDateTimeLocal(g.expiresAt),
        items: items.length ? items : [defaultItem()],
      });
      setEditingId(id);
    } catch (error) {
      setErrorMessage('Failed to load giveaway.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', expiresAt: '', items: [defaultItem()] });
    clearMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!form.name.trim()) {
      setErrorMessage('Giveaway name is required.');
      return;
    }
    if (!form.expiresAt) {
      setErrorMessage('Expiry date is required.');
      return;
    }
    const validItems = form.items.filter((it) => it.productId);
    if (validItems.length === 0) {
      setErrorMessage('Add at least one item with a product.');
      return;
    }
    const payload = {
      name: form.name.trim(),
      expiresAt: form.expiresAt,
      items: validItems.map((it) => ({
        productId: it.productId,
        name: it.name || undefined,
        couponCodes: it.couponCodes || [],
        walletAddresses: it.walletAddresses || [],
        paidDeliveryByUser: it.paidDeliveryByUser !== false,
        claimType: it.claimType || 'immediate',
        claimWindowStart: it.claimType === 'time_window' && it.claimWindowStart ? it.claimWindowStart : null,
        claimWindowEnd: it.claimType === 'time_window' && it.claimWindowEnd ? it.claimWindowEnd : null,
      })),
    };
    setSubmitting(true);
    try {
      if (editingId) {
        await adminService.updateGiveaway(editingId, payload);
        setSuccessMessage('Giveaway updated.');
        setEditingId(null);
        setForm({ name: '', expiresAt: '', items: [defaultItem()] });
      } else {
        await adminService.createGiveaway(payload);
        setSuccessMessage('Giveaway created successfully.');
        setForm({ name: '', expiresAt: '', items: [defaultItem()] });
      }
      fetchGiveaways();
    } catch (error) {
      setErrorMessage(error?.response?.data?.errors?.[0]?.msg || (editingId ? 'Failed to update giveaway.' : 'Failed to create giveaway.'));
    } finally {
      setSubmitting(false);
    }
  };

  const isExpired = (date) => date && new Date(date) <= new Date();

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate(AppRoutes.admin.path)} className="bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
              <Gift className="h-6 w-6 text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Giveaways</h1>
              <p className="text-neutral-400 text-sm">Create and manage giveaways with products, coupon codes or wallet allow lists.</p>
            </div>
          </div>

          {errorMessage && <p className="text-red-400 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-400 text-sm mb-4">{successMessage}</p>}

          <Card className="p-6 bg-neutral-800/50 border-neutral-700 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white">
                {editingId ? 'Edit giveaway' : 'Create giveaway'}
              </h2>
              {editingId && (
                <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit} className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white">
                  Cancel edit
                </Button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Name (section title)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white"
                  placeholder="e.g. Launch Giveaway"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Expires at</label>
                <input
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-neutral-300">Items</label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem} className="bg-transparent border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white">
                    <Plus className="h-4 w-4 mr-1" /> Add item
                  </Button>
                </div>
                <div className="space-y-4">
                  {form.items.map((it, index) => (
                    <div key={index} className="p-4 rounded-lg bg-neutral-800 border border-neutral-600 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <select
                          value={it.productId}
                          onChange={(e) => updateItem(index, 'productId', e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm"
                        >
                          <option value="">Select product</option>
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                          ))}
                        </select>
                        {form.items.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="bg-transparent text-red-400 hover:bg-neutral-700 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          id={`paid-delivery-${index}`}
                          type="checkbox"
                          className="accent-primaryp-300"
                          checked={it.paidDeliveryByUser !== false}
                          onChange={(e) => updateItem(index, 'paidDeliveryByUser', e.target.checked)}
                        />
                        <label htmlFor={`paid-delivery-${index}`} className="text-xs text-neutral-300">
                          User pays delivery fee for this item
                        </label>
                      </div>
                      <div className="flex flex-col gap-2 pt-1">
                        <label className="block text-xs text-neutral-400">Claim type</label>
                        <select
                          value={it.claimType || 'immediate'}
                          onChange={(e) => updateItem(index, 'claimType', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-xs"
                        >
                          <option value="immediate">Immediate (any time before expiry)</option>
                          <option value="time_window">Time window</option>
                        </select>
                      </div>
                      {it.claimType === 'time_window' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-xs text-neutral-400 mb-1">Window start</label>
                            <input
                              type="datetime-local"
                              value={it.claimWindowStart || ''}
                              onChange={(e) => updateItem(index, 'claimWindowStart', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-neutral-400 mb-1">Window end</label>
                            <input
                              type="datetime-local"
                              value={it.claimWindowEnd || ''}
                              onChange={(e) => updateItem(index, 'claimWindowEnd', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-xs"
                            />
                          </div>
                        </div>
                      )}
                      {it.claimType !== 'time_window' && (
                        <>
                          <div>
                            <label className="block text-xs text-neutral-400 mb-1">Coupon codes (one per line or comma-separated)</label>
                            <textarea
                              value={(it.couponCodes || []).join('\n')}
                              onChange={(e) => updateItem(index, 'couponCodes', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm font-mono"
                              placeholder="CODE1&#10;CODE2"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-neutral-400 mb-1">Wallet addresses (one per line or comma-separated)</label>
                            <textarea
                              value={(it.walletAddresses || []).join('\n')}
                              onChange={(e) => updateItem(index, 'walletAddresses', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white text-sm font-mono"
                              placeholder="0x..."
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="bg-primaryp-300 hover:bg-primaryp-400 text-neutral-900 border-0">
                {submitting ? (editingId ? 'Updating…' : 'Creating…') : (editingId ? 'Update giveaway' : 'Create giveaway')}
              </Button>
            </form>
          </Card>

          <div>
            <h2 className="text-lg font-medium text-white mb-4">Existing giveaways</h2>
            {loading && <p className="text-neutral-400">Loading…</p>}
            {!loading && giveaways.length === 0 && <p className="text-neutral-500">No giveaways yet.</p>}
            <div className="space-y-3">
              {giveaways.map((g) => (
                <div
                  key={g._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-neutral-800/50 border border-neutral-700"
                >
                  <div>
                    <p className="font-medium text-white">{g.name}</p>
                    <p className="text-sm text-neutral-400">
                      {g.items?.length || 0} item(s) · expires {g.expiresAt ? new Date(g.expiresAt).toLocaleString() : '—'}
                      {isExpired(g.expiresAt) && <span className="text-amber-400 ml-2">(expired)</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(g._id)} className="bg-transparent border-neutral-500 text-neutral-300 hover:bg-neutral-700 hover:text-white">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(g._id)} className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-500/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GiveawayManagement;
