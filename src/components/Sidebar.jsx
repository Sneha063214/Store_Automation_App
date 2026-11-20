import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Receipt,
  Truck,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Store,
  AlertTriangle,
} from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }) {
  const { user, logout, settings, lowStockProducts } = useStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'POS / Billing', icon: ShoppingCart, highlight: true },
    { id: 'products', label: 'Products', icon: Package },
    { 
      id: 'inventory', 
      label: 'Inventory', 
      icon: Boxes, 
      badge: lowStockProducts.length > 0 ? lowStockProducts.length : null 
    },
    { id: 'sales', label: 'Sales History', icon: Receipt },
    { id: 'purchases', label: 'Purchases', icon: Truck },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-64 bg-white border-r border-sky-100 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-5 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight truncate max-w-[150px]">
                {settings.storeName || 'Kirana Store'}
              </h1>
              <p className="text-[11px] text-sky-700 font-medium">Store Management</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-600 p-1"
          >
            ✕
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-sky-50 hover:text-sky-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isActive ? 'bg-white text-sky-800' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-sky-100 bg-sky-50/40">
          <div className="flex items-center justify-between p-2 rounded-md bg-white border border-sky-100">
            <div className="overflow-hidden pr-2">
              <p className="text-xs font-semibold text-gray-800 truncate">{user?.name || 'Manager'}</p>
              <p className="text-[11px] text-gray-500 truncate capitalize">{user?.role || 'Admin'}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
