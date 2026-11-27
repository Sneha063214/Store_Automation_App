import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Store,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  UserPlus,
  LogIn,
  ShieldCheck,
  BadgeAlert,
} from 'lucide-react';
import { DEMO_USER } from '../data/initialData';
import Footer from '../components/Footer';

export default function Login() {
  const { login, register, settings } = useStore();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Student / Cashier');

  // Messages
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    const res = login(username, password);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setError('Please fill out all fields.');
      return;
    }

    const res = register({
      name: regName,
      username: regUsername,
      password: regPassword,
      role: regRole,
    });

    if (!res.success) {
      setError(res.message);
    }
  };

  const handleFillDemo = (userType = 'admin') => {
    if (userType === 'student') {
      setUsername('student');
      setPassword('student123');
    } else {
      setUsername(DEMO_USER.username);
      setPassword(DEMO_USER.password);
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top institution badge */}
      <div className="p-4 flex justify-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs">
          <GraduationCap className="w-4 h-4 text-sky-600" />
          ABESEC Ghaziabad
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white border border-sky-100 rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Brand */}
          <div className="text-center mb-5">
            <div className="w-14 h-14 bg-sky-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Store className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {settings.storeName || 'Martify'}
            </h1>
            <p className="text-xs sm:text-sm text-sky-800 mt-0.5">
              Store Management System
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                mode === 'login'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                mode === 'register'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-lg flex items-center gap-2">
              <BadgeAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                    placeholder="e.g. admin or student"
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

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="text-xs text-sky-700 hover:text-sky-900 font-medium underline"
                >
                  New here? Create a new user account
                </button>
              </div>
            </form>
          )}

          {/* CREATE ACCOUNT FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Choose unique username"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Assign User Role *
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="Student / Cashier">Student / Cashier (Counter Operations)</option>
                  <option value="Administrator">Administrator (Full Store Access)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-sm mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Sign In</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="text-xs text-sky-700 hover:text-sky-900 font-medium underline"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </form>
          )}

          {/* Demo credentials quick autofill box */}
          <div className="mt-5 pt-4 border-t border-sky-100 bg-sky-50/60 -mx-6 -mb-6 p-5 rounded-b-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-950 uppercase tracking-wider">
                Demo Credentials
              </span>
              <span className="text-[10px] text-gray-500">Tap to autofill:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  handleFillDemo('admin');
                }}
                className="p-2 rounded-lg bg-white border border-sky-200 text-left hover:border-sky-400 hover:bg-sky-50/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-sky-800">Admin</span>
                  <CheckCircle2 className="w-3 h-3 text-sky-600" />
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">admin / password123</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  handleFillDemo('student');
                }}
                className="p-2 rounded-lg bg-white border border-sky-200 text-left hover:border-sky-400 hover:bg-sky-50/80 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-sky-800">Student</span>
                  <CheckCircle2 className="w-3 h-3 text-sky-600" />
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">student / student123</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
