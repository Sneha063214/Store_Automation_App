import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  IndianRupee,
  Package,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Truck,
  ShoppingCart,
  Boxes,
} from 'lucide-react';

export default function Dashboard({ setCurrentPage }) {
  const {
    products,
    sales,
    lowStockProducts,
    todaySalesTotal,
    todayOrdersCount,
    settings,
  } = useStore();

  const currency = settings.currency || '₹';

  // Total products in store
  const totalProducts = products.length;

  // Recent 5 sales
  const recentSales = sales.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Welcome to {settings.storeName}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time Martify store performance, inventory status and today's billing overview.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setCurrentPage('pos')}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Open POS Counter</span>
          </button>
          <button
            onClick={() => setCurrentPage('purchases')}
            className="flex items-center gap-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Truck className="w-4 h-4" />
            <span>Add Inward Purchase</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Today's Sales
            </span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <span className="font-bold text-base">{currency}</span>
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-gray-900">
              {currency}{todaySalesTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-sky-800 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{todayOrdersCount} orders placed today</span>
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3>
            <p className="text-xs text-gray-500 mt-1">
              Active items in store catalog
            </p>
          </div>
        </div>

        {/* Total Orders / Bills */}
        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-gray-900">{sales.length}</h3>
            <p className="text-xs text-gray-500 mt-1">
              All recorded customer bills
            </p>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => setCurrentPage('inventory')}
          className={`border rounded-xl p-5 shadow-xs cursor-pointer transition-all ${
            lowStockProducts.length > 0
              ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
              : 'bg-white border-sky-100 hover:border-sky-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Low Stock Items
            </span>
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                lowStockProducts.length > 0
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3
              className={`text-2xl font-bold ${
                lowStockProducts.length > 0 ? 'text-amber-700' : 'text-gray-900'
              }`}
            >
              {lowStockProducts.length}
            </h3>
            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1 font-medium">
              <span>{lowStockProducts.length > 0 ? 'Needs immediate restock' : 'Stock is healthy'}</span>
              <ArrowRight className="w-3 h-3 text-sky-600" />
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Low Stock Alert Box & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-gray-900">
                Low Stock Warning ({lowStockProducts.length})
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('inventory')}
              className="text-xs text-sky-700 hover:text-sky-900 font-medium flex items-center gap-1"
            >
              <span>View Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                {products.length === 0
                  ? "No products added yet. Click Add Product to start stocking your store."
                  : "🎉 All products have sufficient stock levels!"}
              </div>
            ) : (
              lowStockProducts.slice(0, 5).map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-gray-400 text-[11px]">
                      Code: {item.code} &bull; Min: {item.minStock} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                      {item.stock} {item.unit} left
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions / Bills */}
        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-bold text-gray-900">
                Recent Bills & Sales
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('sales')}
              className="text-xs text-sky-700 hover:text-sky-900 font-medium flex items-center gap-1"
            >
              <span>All Sales</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {recentSales.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                No bills recorded yet. Use the POS to make your first sale.
              </div>
            ) : (
              recentSales.map((sale) => (
                <div key={sale.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{sale.id}</span>
                      <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-medium">
                        {sale.paymentMode}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {sale.customerName} &bull; {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {currency}{sale.total.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
