import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Eye,
  Printer,
  X,
  Receipt,
  CreditCard,
  Banknote,
  QrCode,
  Calendar,
} from 'lucide-react';

export default function Sales() {
  const { sales, settings } = useStore();
  const currency = settings.currency || '₹';

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [selectedSale, setSelectedSale] = useState(null);

  // Summary stats
  const totalRevenue = useMemo(() => {
    return sales.reduce((acc, s) => acc + (s.total || 0), 0);
  }, [sales]);

  const avgOrderValue = useMemo(() => {
    return sales.length > 0 ? totalRevenue / sales.length : 0;
  }, [sales, totalRevenue]);

  // Filter sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchSearch =
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.customerPhone && s.customerPhone.includes(searchQuery));
      const matchPayment =
        paymentFilter === 'ALL' || s.paymentMode === paymentFilter;
      return matchSearch && matchPayment;
    });
  }, [sales, searchQuery, paymentFilter]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Sales Revenue
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {currency}{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Across all completed bills</p>
        </div>

        <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Transactions
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{sales.length}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Recorded invoices</p>
        </div>

        <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Average Bill Value
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {currency}{avgOrderValue.toFixed(2)}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Per customer purchase</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Invoice ID or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto">
          {['ALL', 'Cash', 'UPI', 'Card', 'Credit'].map((mode) => (
            <button
              key={mode}
              onClick={() => setPaymentFilter(mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                paymentFilter === mode
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mode === 'ALL' ? 'All Modes' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Transactions Table */}
      <div className="bg-white border border-sky-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-sky-50/70 border-b border-sky-100 text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 text-center">Payment Mode</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No sales records found.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      {sale.id}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {new Date(sale.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                      <span className="text-gray-400 block text-[11px]">
                        {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900 block">
                        {sale.customerName}
                      </span>
                      {sale.customerPhone && (
                        <span className="text-gray-400 text-xs">{sale.customerPhone}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-sky-50 text-sky-800 text-xs px-2.5 py-0.5 rounded-full font-medium border border-sky-100">
                        {sale.paymentMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-gray-600">
                      {sale.items.length}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900">
                      {currency}{sale.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium px-2.5 py-1 rounded hover:bg-sky-50 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Details Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-4 py-3 bg-sky-50 border-b border-sky-100 flex items-center justify-between no-print">
              <h3 className="font-bold text-gray-900 text-sm">
                Invoice Details - {selectedSale.id}
              </h3>
              <button
                onClick={() => setSelectedSale(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div id="printable-receipt" className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="text-center border-b pb-3 border-dashed border-gray-300">
                <h2 className="font-bold text-base text-gray-900 font-sans">
                  {settings.storeName}
                </h2>
                <p className="text-[11px] text-gray-600 font-sans mt-0.5">
                  {settings.address}
                </p>
                <p className="text-[11px] text-gray-600 font-sans">
                  Phone: {settings.phone}
                </p>
                {settings.gstin && (
                  <p className="text-[11px] text-gray-600 font-sans">
                    GSTIN: {settings.gstin}
                  </p>
                )}
              </div>

              <div className="flex justify-between text-[11px] border-b pb-2 border-dashed border-gray-300">
                <div>
                  <p><strong>Invoice:</strong> {selectedSale.id}</p>
                  <p><strong>Customer:</strong> {selectedSale.customerName}</p>
                  {selectedSale.customerPhone && (
                    <p><strong>Phone:</strong> {selectedSale.customerPhone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p>{new Date(selectedSale.date).toLocaleDateString('en-IN')}</p>
                  <p>{new Date(selectedSale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p><strong>Pay Mode:</strong> {selectedSale.paymentMode}</p>
                </div>
              </div>

              {/* Items */}
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-300 text-[11px]">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Rate</th>
                    <th className="py-1 text-right">Amt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedSale.items.map((item, idx) => (
                    <tr key={idx} className="text-[11px]">
                      <td className="py-1 pr-1 truncate max-w-[130px] font-sans">
                        {item.name}
                      </td>
                      <td className="py-1 text-center">{item.quantity}</td>
                      <td className="py-1 text-right">{item.unitPrice.toFixed(2)}</td>
                      <td className="py-1 text-right font-semibold">{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="border-t border-dashed border-gray-300 pt-2 space-y-1 text-right">
                <div className="flex justify-between text-[11px]">
                  <span>Subtotal:</span>
                  <span>{currency}{selectedSale.subtotal.toFixed(2)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-[11px] text-red-600">
                    <span>Discount:</span>
                    <span>-{currency}{selectedSale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-gray-300 pt-1 text-gray-900">
                  <span>NET PAID:</span>
                  <span>{currency}{selectedSale.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-[10px] text-gray-500 pt-3 border-t border-dashed border-gray-300 font-sans">
                <p>{settings.receiptFooter}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2 no-print">
              <button
                type="button"
                onClick={() => setSelectedSale(null)}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
