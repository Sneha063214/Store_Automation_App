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

// Helper to determine if a username belongs to the demo showcase accounts
const isDemoUsername = (username) => {
  const u = (username || '').toLowerCase();
  return u === 'admin' || u === 'student';
};

// Helper to generate a clean, empty store for new custom accounts
const getFreshStoreState = (userName) => ({
  settings: {
    storeName: userName ? `${userName}'s Martify Store` : 'My Martify Store',
    tagline: 'Retail & Grocery Store',
    phone: '',
    address: '',
    gstin: '',
    currency: '₹',
    receiptFooter: 'Thank you for shopping with us! Please visit again.',
  },
  products: [],
  suppliers: [],
  sales: [],
  purchases: [],
});

// Helper to get demo showcase store
const getDemoStoreState = () => ({
  settings: INITIAL_SETTINGS,
  products: INITIAL_PRODUCTS,
  suppliers: INITIAL_SUPPLIERS,
  sales: INITIAL_SALES,
  purchases: INITIAL_PURCHASES,
});

export function StoreProvider({ children }) {
  // Current logged in user
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kirana_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Registered user accounts list
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('kirana_users');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'u_admin',
            name: 'Admin User',
            username: 'admin',
            password: 'password123',
            role: 'Administrator',
          },
          {
            id: 'u_student',
            name: 'Student Operator',
            username: 'student',
            password: 'student123',
            role: 'Student / Cashier',
          },
        ];
  });

  // Helper to load store data for a specific user
  const loadStoreDataForUser = (currentUser) => {
    if (!currentUser) {
      return getDemoStoreState();
    }
    const username = currentUser.username.toLowerCase();
    const storageKey = isDemoUsername(username)
      ? 'martify_demo_store'
      : `martify_user_store_${username}`;

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved store data', e);
      }
    }

    if (isDemoUsername(username)) {
      return getDemoStoreState();
    }
    return getFreshStoreState(currentUser.name);
  };

  const initialStore = loadStoreDataForUser(user);

  const [settings, setSettings] = useState(initialStore.settings);
  const [products, setProducts] = useState(initialStore.products);
  const [suppliers, setSuppliers] = useState(initialStore.suppliers);
  const [sales, setSales] = useState(initialStore.sales);
  const [purchases, setPurchases] = useState(initialStore.purchases);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('kirana_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kirana_user');
    }
  }, [user]);

  // Sync registered users
  useEffect(() => {
    localStorage.setItem('kirana_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Save current store data whenever anything changes for the active user
  useEffect(() => {
    if (!user) return;
    const username = user.username.toLowerCase();
    const storageKey = isDemoUsername(username)
      ? 'martify_demo_store'
      : `martify_user_store_${username}`;

    const currentData = {
      settings,
      products,
      suppliers,
      sales,
      purchases,
    };
    localStorage.setItem(storageKey, JSON.stringify(currentData));
  }, [user, settings, products, suppliers, sales, purchases]);

  // Helper to switch store state to a given user's saved data
  const switchUserStore = (currentUser) => {
    const store = loadStoreDataForUser(currentUser);
    setSettings(store.settings);
    setProducts(store.products);
    setSuppliers(store.suppliers);
    setSales(store.sales);
    setPurchases(store.purchases);
  };

  // Auth: Login with credentials (loads their saved data)
  const login = (username, password) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check registeredUsers in localStorage
    const foundUser = registeredUsers.find(
      (u) => u.username.toLowerCase() === cleanUser
    );

    if (foundUser && foundUser.password === cleanPass) {
      const loggedInUser = {
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role,
      };
      switchUserStore(loggedInUser);
      setUser(loggedInUser);
      return { success: true };
    }

    // 2. Demo Fallback checks
    if (cleanUser === 'admin' && (cleanPass === 'password123' || cleanPass === 'admin123')) {
      const loggedInUser = { username: 'admin', name: 'Admin User', role: 'Administrator' };
      switchUserStore(loggedInUser);
      setUser(loggedInUser);
      return { success: true };
    }
    if (cleanUser === 'student' && (cleanPass === 'student123' || cleanPass === 'password123')) {
      const loggedInUser = { username: 'student', name: 'Student Operator', role: 'Student / Cashier' };
      switchUserStore(loggedInUser);
      setUser(loggedInUser);
      return { success: true };
    }

    return {
      success: false,
      message: 'Invalid username or password. Check credentials or create a new account.',
    };
  };

  // Auth: Register (Creates fresh, clean, empty store for new account)
  const register = (userData) => {
    const cleanUser = userData.username?.trim().toLowerCase();
    const cleanPass = userData.password?.trim();
    const cleanName = userData.name?.trim();
    const role = userData.role || 'Student / Cashier';

    if (!cleanUser || !cleanPass || !cleanName) {
      return { success: false, message: 'Please fill in all required fields.' };
    }
    if (cleanUser.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters.' };
    }
    if (cleanPass.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters.' };
    }

    // Check duplicate username
    const exists = registeredUsers.some(
      (u) => u.username.toLowerCase() === cleanUser
    );
    if (exists || isDemoUsername(cleanUser)) {
      return {
        success: false,
        message: 'This username is already taken. Please choose another username.',
      };
    }

    const newUser = {
      id: 'u_' + Date.now(),
      name: cleanName,
      username: cleanUser,
      password: cleanPass,
      role: role,
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev, newUser]);

    // Initialize fresh empty store for this new user
    const freshStore = getFreshStoreState(cleanName);
    localStorage.setItem(
      `martify_user_store_${cleanUser}`,
      JSON.stringify(freshStore)
    );

    // Apply fresh store values
    setSettings(freshStore.settings);
    setProducts(freshStore.products);
    setSuppliers(freshStore.suppliers);
    setSales(freshStore.sales);
    setPurchases(freshStore.purchases);

    // Set logged in user
    const loggedInUser = {
      username: newUser.username,
      name: newUser.name,
      role: newUser.role,
    };
    setUser(loggedInUser);

    return { success: true, user: loggedInUser };
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

    // Increase product stock & update purchase rate
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

  // Reset current store to empty fresh state
  const resetStoreToEmpty = () => {
    setProducts([]);
    setSuppliers([]);
    setSales([]);
    setPurchases([]);
  };

  // Load demo sample items into current store
  const loadSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    setSuppliers(INITIAL_SUPPLIERS);
    setSales(INITIAL_SALES);
    setPurchases(INITIAL_PURCHASES);
  };

  // Reset everything to original demo state
  const resetToDemoData = () => {
    const demo = getDemoStoreState();
    setProducts(demo.products);
    setSuppliers(demo.suppliers);
    setSales(demo.sales);
    setPurchases(demo.purchases);
    setSettings(demo.settings);
    localStorage.removeItem('martify_demo_store');
  };

  // Computed metrics for Dashboard
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

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
        register,
        logout,
        registeredUsers,
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
        resetStoreToEmpty,
        loadSampleData,
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
