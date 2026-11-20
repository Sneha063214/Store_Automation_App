import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Store,
  Save,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  Receipt,
  Phone,
  MapPin,
} from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings, resetToDemoData } = useStore();
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    resetToDemoData();
    setResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-xs text-gray-500">
          Configure basic store details, receipt headers and application preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-lg text-xs md:text-sm flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Store settings have been updated and saved to localStorage.</span>
        </div>
      )}

      {/* Basic Store Info Card */}
      <div className="bg-white border border-sky-100 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-sky-50/70 border-b border-sky-100 flex items-center gap-2">
          <Store className="w-4 h-4 text-sky-700" />
          <h2 className="text-sm font-bold text-gray-900">
            Store Profile & Invoice Details
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Store Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contact Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                GSTIN / Tax Number (Optional)
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) =>
                  setFormData({ ...formData, gstin: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Store Address (Printed on Bills) *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                required
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Receipt Footer Message
              </label>
              <input
                type="text"
                value={formData.receiptFooter}
                onChange={(e) =>
                  setFormData({ ...formData, receiptFooter: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center gap-2 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo Data Management Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gray-500" />
              <span>Demo Sample Data</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Reset all inventory, sales, products and supplier lists back to default Kirana sample data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors whitespace-nowrap"
          >
            Reset to Sample Data
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-red-100 w-full max-w-sm p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">
              Reset All Store Data?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              This will overwrite your localStorage changes and restore original sample Kirana products and transactions.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setResetConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
