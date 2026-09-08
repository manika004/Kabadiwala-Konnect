import React, { useState } from 'react';
import { UserRole, AuthUser } from '../../types';
import { Recycle, User, Truck, Factory, Shield, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

const ROLES: {
  id: UserRole;
  title: string;
  badge: string;
  description: string;
  icon: typeof User;
  color: string;
  activeColor: string;
  defaultPhone: string;
  defaultName: string;
}[] = [
  {
    id: 'customer',
    title: 'Household / Resident',
    badge: 'Sell Scrap',
    description: 'Scan household waste with AI, request doorstep pickup, get paid instantly.',
    icon: User,
    color: 'border-slate-200 hover:border-emerald-300 bg-white',
    activeColor: 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-emerald-900',
    defaultPhone: '9876543210',
    defaultName: 'Aarav Sharma'
  },
  {
    id: 'collector',
    title: 'Kabadiwala (Collector)',
    badge: 'Daily Earnings',
    description: 'Receive nearby pickup alerts, record actual scale weight, track earnings.',
    icon: Truck,
    color: 'border-slate-200 hover:border-blue-300 bg-white',
    activeColor: 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-900',
    defaultPhone: '9811122334',
    defaultName: 'Ramesh Kumar'
  },
  {
    id: 'recycler',
    title: 'Recycler Depot Hub',
    badge: 'Bulk Inventory',
    description: 'Monitor aggregated stock levels across 6 categories & dispatch to mills.',
    icon: Factory,
    color: 'border-slate-200 hover:border-purple-300 bg-white',
    activeColor: 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20 text-purple-900',
    defaultPhone: '9844455667',
    defaultName: 'EcoCycle Aggregators Hub'
  },
  {
    id: 'admin',
    title: 'Central Platform Admin',
    badge: 'Oversight',
    description: 'Configure indicative scrap buy-rates, audit receipts, view circular metrics.',
    icon: Shield,
    color: 'border-slate-200 hover:border-slate-400 bg-white',
    activeColor: 'border-slate-900 bg-slate-100 ring-2 ring-slate-800/20 text-slate-900',
    defaultPhone: '9999900000',
    defaultName: 'Operations Admin'
  }
];

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [phone, setPhone] = useState<string>('9876543210');
  const [name, setName] = useState<string>('Aarav Sharma');
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const matched = ROLES.find(r => r.id === role);
    if (matched) {
      setPhone(matched.defaultPhone);
      setName(matched.defaultName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);

    const user: AuthUser = {
      id: 'user-' + selectedRole + '-' + cleanPhone.slice(-4),
      name: name.trim() || ROLES.find(r => r.id === selectedRole)?.defaultName || 'User',
      phone: '+91 ' + cleanPhone.slice(-10),
      role: selectedRole,
      address: selectedRole === 'customer' ? 'Flat 402, Green Meadows, Sector 14, Gurugram' : 'Sector 14 Stand, Gurugram'
    };

    onLoginSuccess(user);
  };

  const activeRoleObj = ROLES.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30 mb-2">
            <Recycle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Kabadiwala <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">Konnect</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            AI-Assisted Circular Waste Identification & Smart Doorstep Pickup
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
          
          {/* Sign In vs Sign Up Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                !isSignUp 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In with Mobile
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                isSignUp 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              New User Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Select Your Role / View */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Select Account View
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLES.map(role => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      type="button"
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all relative group ${
                        isSelected ? role.activeColor : role.color
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className={`p-2 rounded-xl ${isSelected ? 'bg-white text-slate-900 shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold block">{role.title}</span>
                            <span className="text-[10px] font-semibold text-slate-400 block">{role.badge}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                        {role.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Mobile Number */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Enter Mobile Number
              </label>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-3.5 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center rounded-2xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 bg-white">
                  <span className="px-3.5 py-3.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-600 flex items-center space-x-1">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError(null);
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full p-3.5 text-sm font-mono font-bold tracking-wider text-slate-900 focus:outline-none bg-transparent"
                  />
                </div>
                {error && (
                  <p className="text-xs text-rose-500 font-medium mt-1.5">{error}</p>
                )}
              </div>

              {/* Quick Preset Buttons */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Quick Demo Profiles (1-Click Fill)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ROLES.map(r => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition border ${
                        selectedRole === r.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r.defaultName} ({r.title.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition transform hover:-translate-y-0.5"
            >
              <span>{isSignUp ? 'Create Account & Enter Dashboard' : `Sign In as ${activeRoleObj?.title.split(' ')[0]} ➔`}</span>
            </button>

            <div className="flex items-center justify-center space-x-1 text-xs text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant demo login • Zero password hassle</span>
            </div>
          </form>
        </div>

        {/* Value Prop Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500">
          <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/60">
            <span className="font-bold text-slate-800 block">AI Vision Scan</span>
            <span>Instant classification</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/60">
            <span className="font-bold text-slate-800 block">Smart Match</span>
            <span>Nearest Kabadiwala</span>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/60">
            <span className="font-bold text-slate-800 block">Digital Weighing</span>
            <span>Transparent receipts</span>
          </div>
        </div>

      </div>
    </div>
  );
};
