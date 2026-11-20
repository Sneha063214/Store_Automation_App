import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Truck,
  Plus,
  Search,
  CheckCircle,
  X,
  Package,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function Purchases() {
  const { purchases, recordPurchase, products, suppliers, settings } = useStore();
  const currency = settings.currency || '₹';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    supplierId: '',
    invoiceNo: '',
    productId: '',
    quantity: '10',
    purchaseRate: '',
    notes: '',
  });

  // Calculate total spent on purchases
  const totalPurchaseSpend = useMemo(() => {
    return purchases.reduce((acc, p) => acc + (p.totalAmount || 0), 0);
  }, [purchases]);

  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      return (
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [purchases, searchQuery]);

  const handleOpenModal = () => {
    const firstSupplier = suppliers[0]?.id || '';
    const firstProduct = products[0]?.id || '';
    const defaultRate = products[0]?.purchasePrice || '';

    setFormData({
      supplierId: firstSupplier,
      invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: firstProduct,
      quantity: '10',
      purchaseRate: defaultRate.toString(),
      notes: 'Inward stock delivery',
    });
    setIsModalOpen(true);
  };

  const handleProductChange = (prodId) => {
    const prod = products.find((p) => p.id === prodId);
    setFormData((prev) => ({
      ...prev,
      productId: prodId,
      purchaseRate: prod ? prod.purchasePrice.toString() : prev.purchaseRate,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productId) return;

    const selectedProd = products.find((p) => p.id === formData.productId);
    const selectedSupp = suppliers.find((s) => s.id === formData.supplierId);

    const purchasePayload = {
      supplierId: formData.supplierId,
      supplierName: selectedSupp ? selectedSupp.name : 'Direct Wholesale',
      invoiceNo: formData.invoiceNo,
      productId: formData.productId,
      productName: selectedProd ? selectedProd.name : 'Unknown Product',
      quantity: parseInt(formData.quantity, 10) || 1,
      purchaseRate: parseFloat(formData.purchaseRate) || 0,
      notes: formData.notes,
    };

    // recordPurchase automatically increases product stock!
    recordPurchase(purchasePayload);

    setSuccessMsg(
      `Stock updated successfully! Added ${purchasePayload.quantity} units to "${purchasePayload.productName}".`
    );
    setTimeout(() => setSuccessMsg(''), 5000);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Stock Purchases & Inward Orders
          </h1>
          <p className="text-xs text-gray-500">
            Receive wholesale goods from suppliers and automatically update store stock.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Inward Purchase</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs md:text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="p-1 text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Purchase Outflow
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {currency}{totalPurchaseSpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Total wholesale procurement expense</p>
        </div>

        <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Purchase Invoices
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {purchases.length}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Recorded delivery shipments</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by product, supplier or invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white border border-sky-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-sky-50/70 border-b border-sky-100 text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Bill/Invoice #</th>
                <th className="py-3 px-4">Purchased Product</th>
                <th className="py-3 px-4 text-center">Qty Added</th>
                <th className="py-3 px-4 text-right">Cost Rate</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No purchase records found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((pur) => (
                  <tr key={pur.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {new Date(pur.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {pur.supplierName}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600 text-xs">
                      {pur.invoiceNo}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {pur.productName}
                      {pur.notes && (
                        <span className="block text-[11px] text-gray-400">
                          {pur.notes}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-xs">
                        +{pur.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {currency}{pur.purchaseRate.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      {currency}{pur.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Inward Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-sky-100 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-600" />
                <span>Receive Inward Purchase Order</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Supplier *
                  </label>
                  <select
                    required
                    value={formData.supplierId}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierId: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Supplier Bill / Invoice # *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.invoiceNo}
                    onChange={(e) =>
                      setFormData({ ...formData, invoiceNo: e.target.value })
                    }
                    placeholder="e.g. INV-9021"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Product to Restock *
                </label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.stock} {p.unit} currently) - {p.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Quantity Received *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Purchase Rate / Unit ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.purchaseRate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseRate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Total Calculation Note */}
              <div className="p-3 bg-sky-50/80 rounded-lg flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Total Bill Amount:</span>
                <span className="text-base font-bold text-sky-800">
                  {currency}
                  {(
                    (parseInt(formData.quantity, 10) || 0) *
                    (parseFloat(formData.purchaseRate) || 0)
                  ).toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Notes / Batch Info
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="e.g. Fresh stock from APMC mandi"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
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
                  Receive & Increase Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
