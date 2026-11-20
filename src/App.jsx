import React, { useState } from 'react';
import { useStore } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';

export default function App() {
  const { user } = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If not logged in, render Login page
  if (!user) {
    return <Login />;
  }

  // Active page router
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'products':
        return <Products />;
      case 'inventory':
        return <Inventory setCurrentPage={setCurrentPage} />;
      case 'pos':
        return <POS />;
      case 'sales':
        return <Sales />;
      case 'purchases':
        return <Purchases />;
      case 'suppliers':
        return <Suppliers />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar navigation */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-screen">
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
