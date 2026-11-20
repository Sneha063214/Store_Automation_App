import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Boxes,
  Plus,
  Minus,
  Edit3,
  X,
} from 'lucide-react';

export default function Inventory({ setCurrentPage }) {
  const { products, updateProduct, lowStockProducts, settings } = useStore();
  const currency = settings.currency || '₹';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState('ADD'); // 'ADD' | 'SET'

  // Summary stats
  const totalUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.stock || 0), 0);
  }, [products]);

  const totalInventoryValue = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + (p.stock || 0) * (p.purchasePrice || 0),
      0
    );
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.stock === 0).length;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterMode === 'LOW_STOCK') {
        return p.stock > 0 && p.stock <= p.minStock;
      }
      if (filterMode === 'OUT_OF_STOCK') {
        return p.stock === 0;
      }
      return true;
    });
  }, [products, searchQuery, filterMode]);

  const handleOpenAdjust = (prod) => {
    setSelectedProduct(prod);
    setAdjustAmount('5');
    setAdjustType('ADD');
  };

  const handleSaveAdjust = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const num = parseInt(adjustAmount, 10) || 0;
    let newStock = selectedProduct.stock;

    if (adjustType === 'ADD') {
      newStock += num;
    } else if (adjustType === 'SUB') {
      newStock = Math.max(0, newStock - num);
    } else {
      newStock = Math.max(0, num);
    }

    updateProduct(selectedProduct.id, { stock: newStock });
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total In-Store Stock
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalUnits} units</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Across {products.length} products</p>
        </div>

        <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Inventory Valuation
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {currency}{totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">At wholesale cost price</p>
        </div>

        <div
          onClick={() => setFilterMode('LOW_STOCK')}
          className={`border rounded-xl p-4 shadow-xs cursor-pointer transition-colors ${
            filterMode === 'LOW_STOCK'
              ? 'bg-amber-100/50 border-amber-300'
              : 'bg-white border-sky-100 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Low Stock Items
            </p>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-800 mt-1">
            {lowStockProducts.length}
          </p>
          <p className="text-[11px] text-amber-700 mt-0.5">Below alert threshold</p>
        </div>

        <div
          onClick={() => setFilterMode('OUT_OF_STOCK')}
          className={`border rounded-xl p-4 shadow-xs cursor-pointer transition-colors ${
            filterMode === 'OUT_OF_STOCK'
              ? 'bg-red-100/50 border-red-300'
              : 'bg-white border-sky-100 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">
              Out of Stock
            </p>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-700 mt-1">
            {outOfStockCount}
          </p>
          <p className="text-[11px] text-red-600 mt-0.5">Zero quantity items</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search inventory by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterMode === 'ALL'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setFilterMode('LOW_STOCK')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterMode === 'LOW_STOCK'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-800'
            }`}
          >
            Low Stock ({lowStockProducts.length})
          </button>
          <button
            onClick={() => setFilterMode('OUT_OF_STOCK')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterMode === 'OUT_OF_STOCK'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-800'
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-sky-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-sky-50/70 border-b border-sky-100 text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Item Code</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Available Stock</th>
                <th className="py-3 px-4 text-center">Min Threshold</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No inventory records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.stock === 0;
                  const isLow = !isOutOfStock && p.stock <= p.minStock;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-500 font-medium text-xs">
                        {p.code}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900 block">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Cost: {currency}{p.purchasePrice} &bull; MRP: {currency}{p.sellingPrice}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-sky-50 text-sky-800 text-xs px-2 py-0.5 rounded font-medium border border-sky-100">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-900 text-sm">
                        {p.stock} <span className="text-xs font-normal text-gray-500">{p.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-center text-xs text-gray-500">
                        {p.minStock} {p.unit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                            <XCircle className="w-3 h-3" />
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-medium px-2 py-0.5 rounded-full text-[11px]">
                            <CheckCircle className="w-3 h-3" />
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(p)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1.5 rounded-md transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Adjust</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Adjust Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-sky-100 w-full max-w-sm overflow-hidden">
            <div className="px-4 py-3 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">
                Adjust Inventory Stock
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjust} className="p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500">Selected Product</p>
                <p className="font-semibold text-gray-900 text-sm">{selectedProduct.name}</p>
                <p className="text-xs text-sky-700 font-medium">
                  Current Stock: {selectedProduct.stock} {selectedProduct.unit}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('ADD')}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      adjustType === 'ADD'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    + Add Qty
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('SUB')}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      adjustType === 'SUB'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    - Deduct
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('SET')}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      adjustType === 'SET'
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    = Set Exact
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Quantity ({selectedProduct.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-xs"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
