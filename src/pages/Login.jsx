import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Store, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DEMO_USER } from '../data/initialData';

export default function Login() {
  const { login, settings } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    const res = login(username, password);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleFillDemo = () => {
    setUsername(DEMO_USER.username);
    setPassword(DEMO_USER.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-sky-100 rounded-2xl shadow-sm p-6 sm:p-8">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-sky-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {settings.storeName || 'Kirana Store'}
          </h1>
          <p className="text-xs sm:text-sm text-sky-800 mt-1">
            Store Management System &bull; Staff Login
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Sign In to Store</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo credentials box */}
        <div className="mt-6 pt-5 border-t border-sky-100 bg-sky-50/60 -mx-6 -mb-6 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-sky-900 uppercase tracking-wider">
              Demo Credentials
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 underline flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Auto Fill
            </button>
          </div>
          <p className="text-xs text-gray-600">
            Username: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-sky-200 font-bold">admin</code>
            {' '} &bull; {' '}
            Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-sky-200 font-bold">password123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
