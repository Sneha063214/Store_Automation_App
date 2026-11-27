import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SETTINGS,
  DEMO_USER,
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_SALES,
  INITIAL_PURCHASES,
} from '../data/initialData';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kirana_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('kirana_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Products
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('kirana_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Suppliers
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('kirana_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  // Sales
  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('kirana_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  // Purchases
  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem('kirana_purchases');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
  });

  // Keep localStorage updated
  useEffect(() => {
    if (user) {
      localStorage.setItem('kirana_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kirana_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kirana_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('kirana_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kirana_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('kirana_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('kirana_purchases', JSON.stringify(purchases));
  }, [purchases]);

  // Auth functions
  const login = (username, password) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser === "admin" && (cleanPass === "password123" || cleanPass === "admin123")) {
      const loggedInUser = {
        username: "admin",
        name: "Admin User",
        role: "Administrator",
      };
      setUser(loggedInUser);
      return { success: true };
    }

    if (cleanUser === "student" && (cleanPass === "student123" || cleanPass === "password123")) {
      const loggedInUser = {
        username: "student",
        name: "Student Operator",
        role: "Student / Cashier",
      };
      setUser(loggedInUser);
      return { success: true };
    }

    if (
      (cleanUser === DEMO_USER.username && cleanPass === DEMO_USER.password) ||
      (cleanUser.length >= 3 && cleanPass.length >= 4) // forgiving for demo purposes
    ) {
      const loggedInUser = {
        username: cleanUser,
        name: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1),
        role: cleanUser === "admin" ? "Administrator" : "Student / Cashier",
      };
      setUser(loggedInUser);
      return { success: true };
    }
    return { success: false, message: "Invalid username or password. Use admin / password123 or student / student123" };
  };

  const logout = () => {
    setUser(null);
  };

  // Products CRUD
  const addProduct = (productData) => {
    const newProduct = {
      id: 'p_' + Date.now(),
      code: productData.code || `KRN-${Math.floor(100 + Math.random() * 900)}`,
      name: productData.name.trim(),
      category: productData.category.trim() || 'General',
      purchasePrice: parseFloat(productData.purchasePrice) || 0,
      sellingPrice: parseFloat(productData.sellingPrice) || 0,
      unit: productData.unit || 'pkt',
      stock: parseInt(productData.stock, 10) || 0,
      minStock: parseInt(productData.minStock, 10) || 5,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedFields,
              purchasePrice: parseFloat(updatedFields.purchasePrice ?? item.purchasePrice),
              sellingPrice: parseFloat(updatedFields.sellingPrice ?? item.sellingPrice),
              stock: parseInt(updatedFields.stock ?? item.stock, 10),
              minStock: parseInt(updatedFields.minStock ?? item.minStock, 10),
            }
          : item
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Suppliers CRUD
  const addSupplier = (supplierData) => {
    const newSupplier = {
      id: 's_' + Date.now(),
      name: supplierData.name.trim(),
      contactPerson: supplierData.contactPerson?.trim() || '',
      phone: supplierData.phone?.trim() || '',
      email: supplierData.email?.trim() || '',
      address: supplierData.address?.trim() || '',
      category: supplierData.category?.trim() || 'General Provisions',
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    return newSupplier;
  };

  const updateSupplier = (id, updatedFields) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteSupplier = (id) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // POS / Sales: Automatically decrease stock!
  const recordSale = (saleData) => {
    const invoiceId = 'INV-' + Math.floor(1000 + Math.random() * 9000);
    const newSale = {
      id: invoiceId,
      date: new Date().toISOString(),
      customerName: saleData.customerName?.trim() || 'Walk-in Customer',
      customerPhone: saleData.customerPhone?.trim() || '',
      paymentMode: saleData.paymentMode || 'Cash',
      items: saleData.items,
      subtotal: parseFloat(saleData.subtotal) || 0,
      discount: parseFloat(saleData.discount) || 0,
      tax: parseFloat(saleData.tax) || 0,
      total: parseFloat(saleData.total) || 0,
    };

    // Decrease product stock
    setProducts((prev) =>
      prev.map((prod) => {
        const soldItem = saleData.items.find((it) => it.id === prod.id);
        if (soldItem) {
          const newQty = Math.max(0, prod.stock - soldItem.quantity);
          return { ...prod, stock: newQty };
        }
        return prod;
      })
    );

    setSales((prev) => [newSale, ...prev]);
    return newSale;
  };

  // Purchases: Automatically increase stock!
  const recordPurchase = (purchaseData) => {
    const purchaseId = 'PUR-' + Math.floor(100 + Math.random() * 900);
    const qty = parseInt(purchaseData.quantity, 10) || 0;
    const rate = parseFloat(purchaseData.purchaseRate) || 0;
    const totalAmt = qty * rate;

    const newPurchase = {
      id: purchaseId,
      date: new Date().toISOString(),
      supplierId: purchaseData.supplierId || '',
      supplierName: purchaseData.supplierName || 'General Supplier',
      invoiceNo: purchaseData.invoiceNo?.trim() || `PUR-${Date.now().toString().slice(-4)}`,
      productId: purchaseData.productId,
      productName: purchaseData.productName,
      quantity: qty,
      purchaseRate: rate,
      totalAmount: totalAmt,
      notes: purchaseData.notes?.trim() || '',
    };

    // Increase product stock & update purchase rate if applicable
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === purchaseData.productId) {
          return {
            ...prod,
            stock: prod.stock + qty,
            purchasePrice: rate > 0 ? rate : prod.purchasePrice,
          };
        }
        return prod;
      })
    );

    setPurchases((prev) => [newPurchase, ...prev]);
    return newPurchase;
  };

  // Settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Reset to default
  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales(INITIAL_SALES);
    setPurchases(INITIAL_PURCHASES);
    setSettings(INITIAL_SETTINGS);
    localStorage.removeItem('kirana_products');
    localStorage.removeItem('kirana_suppliers');
    localStorage.removeItem('kirana_sales');
    localStorage.removeItem('kirana_purchases');
    localStorage.removeItem('kirana_settings');
  };

  // Computed metrics for Dashboard
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  // Today's metrics (matches current calendar day)
  const isToday = (isoString) => {
    const d = new Date(isoString);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const todaySalesList = sales.filter((s) => isToday(s.date));
  const todaySalesTotal = todaySalesList.reduce((sum, s) => sum + (s.total || 0), 0);
  const todayOrdersCount = todaySalesList.length;

  return (
    <StoreContext.Provider
      value={{
        user,
        login,
        logout,
        settings,
        updateSettings,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        suppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        sales,
        recordSale,
        purchases,
        recordPurchase,
        resetToDemoData,
        lowStockProducts,
        todaySalesTotal,
        todayOrdersCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
