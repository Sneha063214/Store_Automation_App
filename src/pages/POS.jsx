import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle,
  X,
  CreditCard,
  QrCode,
  Banknote,
  Receipt,
  User,
  Phone,
  AlertCircle,
} from 'lucide-react';

export default function POS() {
  const { products, recordSale, settings } = useStore();
  const currency = settings.currency || '₹';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [discount, setDiscount] = useState(0);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filter products for catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart operations
  const addToCart = (product) => {
    setErrorMsg('');
    if (product.stock <= 0) {
      setErrorMsg(`"${product.name}" is out of stock!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          setErrorMsg(`Only ${product.stock} units available in stock.`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          code: product.code,
          unit: product.unit,
          unitPrice: product.sellingPrice,
          quantity: 1,
          total: product.sellingPrice,
          maxStock: product.stock,
        },
      ];
    });
  };

  const updateQuantity = (id, delta) => {
    setErrorMsg('');
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty > item.maxStock) {
              setErrorMsg(`Cannot add more than available stock (${item.maxStock}).`);
              return item;
            }
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              total: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setErrorMsg('');
  };

  // Cart calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.total, 0);
  }, [cart]);

  const grandTotal = Math.max(0, subtotal - (parseFloat(discount) || 0));

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg('Cart is empty. Add products before generating bill.');
      return;
    }

    const saleData = {
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone,
      paymentMode,
      items: cart,
      subtotal,
      discount: parseFloat(discount) || 0,
      tax: 0,
      total: grandTotal,
    };

    // recordSale automatically decreases stock in StoreContext!
    const createdInvoice = recordSale(saleData);
    setGeneratedInvoice(createdInvoice);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-xs md:text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="p-1 text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* POS Layout: Left Product Picker, Right Bill Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Product Search & Quick Grid */}
        <div className="lg:col-span-7 space-y-3">
          {/* Search bar */}
          <div className="bg-white border border-sky-100 rounded-xl p-3 shadow-xs flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Scan code or search product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                autoFocus
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 text-xs text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                {cat === 'ALL' ? 'All Items' : cat}
              </button>
            ))}
          </div>

          {/* Products List Grid */}
          <div className="bg-white border border-sky-100 rounded-xl p-3 shadow-xs max-h-[560px] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredProducts.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-gray-400 text-xs">
                  {products.length === 0
                    ? "Store catalog is currently empty. Go to Products page to add products before billing."
                    : "No products found matching your search."}
                </div>
              ) : (
                filteredProducts.map((p) => {
                  const isOut = p.stock <= 0;
                  return (
                    <div
                      key={p.id}
                      className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                        isOut
                          ? 'bg-gray-50 border-gray-200 opacity-60'
                          : 'bg-white border-sky-100 hover:border-sky-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[10px] font-mono text-gray-400">
                            {p.code}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              isOut
                                ? 'bg-red-100 text-red-700'
                                : p.stock <= p.minStock
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-sky-50 text-sky-700'
                            }`}
                          >
                            {isOut ? 'Out of Stock' : `${p.stock} ${p.unit}`}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 text-xs md:text-sm mt-1 line-clamp-2">
                          {p.name}
                        </h4>
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-sm md:text-base font-bold text-gray-900">
                            {currency}{p.sellingPrice.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-gray-400"> /{p.unit}</span>
                        </div>
                        <button
                          type="button"
                          disabled={isOut}
                          onClick={() => addToCart(p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isOut
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Active Billing Cart */}
        <div className="lg:col-span-5 bg-white border border-sky-100 rounded-xl shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-gray-900 text-sm md:text-base">
                  Current Bill
                </h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Customer Details (Optional) */}
            <div className="grid grid-cols-2 gap-2 mt-3 pb-3 border-b border-gray-100">
              <div className="relative">
                <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                <input
                  type="tel"
                  placeholder="Mobile No."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Cart Items list */}
            <div className="mt-3 space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  Your cart is empty. Tap "Add" on any product to start billing.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-gray-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex-1 pr-2">
                      <p className="font-semibold text-gray-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {currency}{item.unitPrice} &times; {item.quantity} {item.unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 rounded-l"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-gray-800 text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 rounded-r"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-gray-900 w-16 text-right">
                        {currency}{item.total.toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment & Totals */}
          <div className="pt-3 border-t border-sky-100 mt-4 space-y-3">
            {/* Payment Mode Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                Payment Mode
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {['Cash', 'UPI', 'Card', 'Credit'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-1.5 px-2 rounded-lg font-medium border text-center transition-colors ${
                      paymentMode === mode
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-medium text-gray-900">
                  {currency}{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount ({currency})</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-20 px-2 py-0.5 text-right text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div className="flex justify-between text-sm md:text-base font-bold text-gray-900 pt-1 border-t border-gray-200">
                <span>Grand Total</span>
                <span className="text-sky-700">
                  {currency}{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Complete Sale Button */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm ${
                cart.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Generate Bill ({currency}{grandTotal.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Invoice / Bill Modal */}
      {generatedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-4 py-3 bg-sky-50 border-b border-sky-100 flex items-center justify-between no-print">
              <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Bill Generated Successfully
              </span>
              <button
                onClick={() => setGeneratedInvoice(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Area (Target for print) */}
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
                  <p><strong>Invoice:</strong> {generatedInvoice.id}</p>
                  <p><strong>Customer:</strong> {generatedInvoice.customerName}</p>
                </div>
                <div className="text-right">
                  <p>{new Date(generatedInvoice.date).toLocaleDateString('en-IN')}</p>
                  <p>{new Date(generatedInvoice.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p><strong>Pay Mode:</strong> {generatedInvoice.paymentMode}</p>
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
                  {generatedInvoice.items.map((item, idx) => (
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
                  <span>{currency}{generatedInvoice.subtotal.toFixed(2)}</span>
                </div>
                {generatedInvoice.discount > 0 && (
                  <div className="flex justify-between text-[11px] text-red-600">
                    <span>Discount:</span>
                    <span>-{currency}{generatedInvoice.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-gray-300 pt-1 text-gray-900">
                  <span>NET TOTAL:</span>
                  <span>{currency}{generatedInvoice.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-[10px] text-gray-500 pt-3 border-t border-dashed border-gray-300 font-sans">
                <p>{settings.receiptFooter}</p>
                <p className="mt-1">Computer Generated Bill</p>
              </div>
            </div>

            {/* Modal buttons */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2 no-print">
              <button
                type="button"
                onClick={() => setGeneratedInvoice(null)}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Start New Bill
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
