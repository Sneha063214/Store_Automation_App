import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  X,
  Truck,
} from 'lucide-react';

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    category: 'Grains & Pulses',
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.phone.includes(q)
      );
    });
  }, [suppliers, searchQuery]);

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      category: 'General FMCG & Provisions',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup) => {
    setEditingSupplier(sup);
    setFormData({
      name: sup.name,
      contactPerson: sup.contactPerson,
      phone: sup.phone,
      email: sup.email,
      address: sup.address,
      category: sup.category,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, formData);
    } else {
      addSupplier(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteSupplier(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Supplier Directory</h1>
          <p className="text-xs text-gray-500">
            Manage wholesale distributors, mills, and grocery suppliers.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-sky-100 rounded-xl p-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by supplier name, contact or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white border border-sky-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-sky-50/70 border-b border-sky-100 text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Supplier Firm Name</th>
                <th className="py-3 px-4">Goods Supplied</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No suppliers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900 block">
                        {s.name}
                      </span>
                      {s.email && (
                        <span className="text-[11px] text-gray-400">{s.email}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-sky-50 text-sky-800 text-xs px-2.5 py-0.5 rounded font-medium border border-sky-100">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {s.contactPerson || '—'}
                    </td>
                    <td className="py-3 px-4 text-sky-700 font-medium">
                      {s.phone}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs max-w-[200px] truncate">
                      {s.address || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded transition-colors"
                          title="Edit Supplier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(s.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Delete Supplier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-sky-100 w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-base">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Supplier / Agency Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Rameshwar Wholesale Traders"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Goods / Category Supplied *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g. Pulses, Grains, Edible Oils"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPerson: e.target.value })
                    }
                    placeholder="e.g. Mahesh Gupta"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 98230 11223"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="supplier@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Warehouse / Office Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="e.g. APMC Grain Yard, Shop 14"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-xs"
                >
                  {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-red-100 w-full max-w-sm p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1">
              Delete Supplier?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Are you sure you want to remove this supplier from the directory?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
