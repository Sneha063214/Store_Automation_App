import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Package,
  Check,
} from 'lucide-react';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, settings } = useStore();
  const currency = settings.currency || '₹';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Staples',
    purchasePrice: '',
    sellingPrice: '',
    unit: 'pkt',
    stock: '',
    minStock: '5',
  });

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      code: `KRN-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      category: 'General Staples',
      purchasePrice: '',
      sellingPrice: '',
      unit: 'pkt',
      stock: '10',
      minStock: '5',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      category: product.category,
      purchasePrice: product.purchasePrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      unit: product.unit,
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Products Catalog</h1>
          <p className="text-xs text-gray-500">
            Total {products.length} products available in store
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product name, barcode or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-sky-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-sky-50/70 border-b border-sky-100 text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Cost Price</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-center">Unit</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-gray-500 text-xs">
                        {p.code}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 block">
                          {p.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-sky-50 text-sky-800 text-xs px-2 py-0.5 rounded font-medium border border-sky-100">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-600">
                        {currency}{p.purchasePrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900">
                        {currency}{p.sellingPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center text-xs text-gray-500">
                        {p.unit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full text-xs ${
                            p.stock === 0
                              ? 'bg-red-100 text-red-700'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {isLow && <AlertTriangle className="w-3 h-3" />}
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-sky-100 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Product Code / Barcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g. KRN-101"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g. Staples, Dairy, Oils"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Aashirvaad Chakki Atta 5kg"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Cost / Purchase Price ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.purchasePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, purchasePrice: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Selling Price ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, sellingPrice: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="pkt">pkt</option>
                    <option value="kg">kg</option>
                    <option value="gm">gm</option>
                    <option value="L">L</option>
                    <option value="bottle">bottle</option>
                    <option value="pouch">pouch</option>
                    <option value="pcs">pcs</option>
                    <option value="box">box</option>
                    <option value="pack">pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minStock}
                    onChange={(e) =>
                      setFormData({ ...formData, minStock: e.target.value })
                    }
                    placeholder="5"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-red-100 w-full max-w-sm p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">
              Delete Product?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Are you sure you want to remove this product from the store catalog?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
