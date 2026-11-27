# Martify – Kirana & Retail Store Management System

> **A simple, clean, and responsive retail store management system built with React.js, Vite, and Tailwind CSS for daily kirana shop automation.**

---

## 🌐 Live Deployment (Render)

- **Deployed Application Link:**  
  👉 **`https://<YOUR-RENDER-APP-NAME>.onrender.com`**  
  *(Replace `<YOUR-RENDER-APP-NAME>` with your live Render deployment URL if not already updated)*

---

## 👥 Project Team

- **Institution:** ABES Engineering College (ABESEC), Ghaziabad  
- **Department:** Department of Computer Science & Engineering (AIML)  
- **Class / Section:** CSE AIML (A) - 3rd Year  
- **Team Members:**
  1. **SNEHA SHARMA** — Roll No: `2400321530194`
  2. **ADITYA KUMAR** — Roll No: `2400321530017`
- **Team Role:** Full Stack Development Team  
- **Copyright:** &copy; 2026 ABESEC Ghaziabad. All Rights Reserved.

---

## 🔐 User Login Credentials & Roles

The system includes pre-configured demo user accounts with working authentication. Use the credentials below to log in:

| Role | Username | Password | Role Description & Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator (Admin)** | `admin` | `password123` | **Full Store Control:** Access to POS Billing, Inventory Tracking, Product Catalog (Add/Edit/Delete), Purchase Inward Entries, Supplier Directory, Sales History, and Store Settings & Data Reset. |
| **Student / Cashier** | `student` | `student123` | **Counter & Trainee Operations:** Access to POS Billing Counter, Item Lookup, Low-Stock Monitoring, Customer Bill Generation, and Inward Stock Verification. |

> **Note:** Quick 1-click **"Auto Fill"** buttons are also available directly on the login screen for instant testing.

---

## ✨ Key Features & Functionality

1. **Dashboard Overview**
   - Real-time dynamic metrics: Today's Sales (₹), Total Products in Catalog, Total Customer Orders, and Low Stock count.
   - Immediate low-stock alerts and recent sales transaction list.
2. **Products Management**
   - Live search by product name, barcode, or item code.
   - Filter by grocery categories (Flours, Grains, Staples, Edible Oils, Dairy, Spices, FMCG).
   - Add new products, edit pricing/thresholds, and delete items with modal confirmation.
3. **Inventory & Stock Tracking**
   - Real-time stock status badges: *In Stock*, *Low Stock*, and *Out of Stock*.
   - Filter tab to immediately isolate items needing restock.
   - Quick stock adjustment tool (+ Add, - Deduct, = Set Exact).
4. **POS / Billing Counter**
   - Instant product search and one-click add to cart.
   - Quantity controls with available stock limit checks.
   - Payment modes: Cash, UPI / QR, Card, and Store Credit (Udhar).
   - Subtotal, discount deduction, and net total calculation.
   - **Automatic Stock Deduction:** Completing a sale automatically reduces the product quantity in inventory.
   - **Printable Thermal/A4 Receipt:** Formatted invoice modal with store header, itemized breakdown, and print button (`window.print()`).
5. **Sales History**
   - Complete record of all past customer invoices and timestamps.
   - Filter by payment mode and search by invoice ID or customer mobile number.
   - View details modal to inspect and re-print receipts.
6. **Inward Purchases & Stock Receiving**
   - Record inward stock deliveries from suppliers with invoice number and cost rate.
   - **Automatic Stock Addition:** Recording a purchase automatically increases product inventory.
7. **Suppliers Directory**
   - Add, edit, and view wholesale suppliers with contact details and categories supplied.
8. **Store Settings**
   - Customize Store Name, Tagline, Phone, Address, GSTIN, Currency Symbol (₹), and Receipt footer note.
   - 1-click reset to restore default Kirana sample products and transactions.
9. **Data Persistence**
   - All transactions, products, stock levels, suppliers, and user sessions are stored reliably in the browser's `localStorage` (no database server required).

---

## 🛠️ Tech Stack

- **Frontend Library:** React.js 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (White background, light blue accents `#026bc9` / `sky-600`)
- **Icons:** Lucide React
- **Storage:** Browser LocalStorage API
- **Deployment Platform:** Render

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/Sneha063214/Store_Automation_App.git
cd Store_Automation_App
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```
The optimized production files will be built in the `dist/` directory.

---

## 📄 License & Attribution

Developed as part of the Full Stack Development curriculum at **ABESEC Ghaziabad** by **Sneha Sharma** and **Aditya Kumar** (CSE AIML A).  
&copy; 2026 ABESEC Ghaziabad. All Rights Reserved.
