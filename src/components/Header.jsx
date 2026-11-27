import React from 'react';
import { Menu, ShoppingCart, LogOut, GraduationCap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const titles = {
  dashboard: 'Dashboard Overview',
  products: 'Product Management',
  inventory: 'Stock & Inventory',
  pos: 'POS & Billing Counter',
  sales: 'Sales & Invoices History',
  purchases: 'Purchase Orders & Stock Inward',
  suppliers: 'Supplier Directory',
  settings: 'Store Settings',
};

export default function Header({ currentPage, setCurrentPage, setIsOpen }) {
  const { logout, settings } = useStore();
  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="h-16 bg-white border-b border-sky-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-sky-50"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              {titles[currentPage] || 'Martify'}
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
              <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
              ABESEC Ghaziabad
            </span>
          </div>
          <p className="text-xs text-gray-500 hidden sm:block">
            {settings.storeName} &bull; ABESEC Ghaziabad &bull; {todayStr}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentPage !== 'pos' && (
          <button
            onClick={() => setCurrentPage('pos')}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs md:text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>New Bill</span>
          </button>
        )}

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 border border-gray-200 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
