import React, { useState } from 'react';
import { UserRole, AuthUser } from '../../types';
import { 
  User, 
  Truck, 
  Factory, 
  Shield, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Scan, 
  MapPin, 
  Recycle, 
  Leaf, 
  ArrowRight,
  TrendingUp,
  Check
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

const ROLES: {
  id: UserRole;
  title: string;
  badge: string;
  description: string;
  icon: typeof User;
  accent: string;
  borderActive: string;
  bgActive: string;
  defaultPhone: string;
  defaultName: string;
}[] = [
  {
    id: 'customer',
    title: 'Household / Resident',
    badge: 'Sell Scrap',
    description: 'AI camera scan, book doorstep pickup, get paid instantly via UPI.',
    icon: User,
    accent: 'text-emerald-700',
    borderActive: 'border-emerald-600 ring-2 ring-emerald-500/25',
    bgActive: 'bg-emerald-50/70',
    defaultPhone: '9876543210',
    defaultName: 'Aarav Sharma'
  },
  {
    id: 'collector',
    title: 'Kabadiwala (Collector)',
    badge: 'Daily Earnings',
    description: 'Receive nearby pickup alerts, smart routes, digital scale weighing.',
    icon: Truck,
    accent: 'text-blue-700',
    borderActive: 'border-blue-600 ring-2 ring-blue-500/25',
    bgActive: 'bg-blue-50/70',
    defaultPhone: '9811122334',
    defaultName: 'Ramesh Kumar'
  },
  {
    id: 'recycler',
    title: 'Recycler Depot Hub',
    badge: 'Bulk Inventory',
    description: 'Aggregated stock across 6 categories, quality grading, mill dispatch.',
    icon: Factory,
    accent: 'text-purple-700',
    borderActive: 'border-purple-600 ring-2 ring-purple-500/25',
    bgActive: 'bg-purple-50/70',
    defaultPhone: '9844455667',
    defaultName: 'EcoCycle Aggregators'
  },
  {
    id: 'admin',
    title: 'Platform Admin',
    badge: 'Oversight',
    description: 'Indicative scrap pricing, network analytics, circular ESG metrics.',
    icon: Shield,
    accent: 'text-slate-800',
    borderActive: 'border-slate-800 ring-2 ring-slate-800/25',
    bgActive: 'bg-slate-100',
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
      address: selectedRole === 'customer' 
        ? 'Flat 402, Green Meadows, Sector 14, Gurugram' 
        : 'Sector 14 Stand, Gurugram'
    };

    onLoginSuccess(user);
  };

  const activeRoleObj = ROLES.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px]" />
      <div className="pointer-events-none absolute top-1/2 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-[128px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/15 rounded-full blur-[128px]" />

      {/* Subtle Grid Texture */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* ================= LEFT COLUMN: HERO SHOWCASE WITH OFFICIAL LOGO ================= */}
        <div className="lg:col-span-5 text-white space-y-6 lg:pr-4">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Next-Gen Circular Scrap Network</span>
          </div>

          {/* Logo Showcase Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/15 shadow-2xl shadow-emerald-950/50 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 shrink-0 bg-white p-1">
              <img 
                src="/logo.jpg" 
                alt="Ksquare Logo" 
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  Ksquare
                </h1>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white font-extrabold text-xs tracking-wider shadow-sm">
                  K²
                </span>
              </div>
              <p className="text-xs font-semibold tracking-wider uppercase text-emerald-300">
                Turning Waste into Tomorrow
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Waste • People • Possibilities • Connected
              </p>
            </div>
          </div>

          {/* 4 Pillars from the Logo */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm space-y-1">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Scan className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">1. SCAN</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                AI Vision recognizes scrap category & computes instant value.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm space-y-1">
              <div className="flex items-center space-x-2 text-teal-400">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">2. COLLECT</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Doorstep pickup paired with nearest localized kabadiwala.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm space-y-1">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Recycle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">3. RECYCLE</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Aggregated bulk depot inventory dispatched to processing mills.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm space-y-1">
              <div className="flex items-center space-x-2 text-green-400">
                <Leaf className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">4. IMPACT</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Verified digital receipts & real-time CO₂ offset tracking.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-500/20 rounded-2xl px-4 py-3 text-xs">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Network Impact:</span>
            </div>
            <div className="flex items-center space-x-3 font-bold text-white">
              <span className="text-emerald-400">3,420 kg Diverted</span>
              <span className="text-slate-500">•</span>
              <span className="text-teal-300">1.8T CO₂ Saved</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE AUTH FORM ================= */}
        <div className="lg:col-span-7">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl shadow-black/40 p-6 sm:p-8 space-y-6">
            
            {/* Header / Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Welcome to <span className="text-emerald-700">Ksquare</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your role view & access your live dashboard
                </p>
              </div>

              {/* Sign In vs Sign Up Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    !isSignUp 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isSignUp 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Select Your Role / View */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">1</span>
                    <span>Select Account View</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Role selection is configured here</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLES.map(role => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;
                    return (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                          isSelected 
                            ? `${role.borderActive} ${role.bgActive} shadow-sm` 
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-center space-x-2.5">
                            <div className={`p-2 rounded-xl transition ${
                              isSelected 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'bg-slate-100 text-slate-600 group-hover:bg-white'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-900 block leading-tight">
                                {role.title}
                              </span>
                              <span className={`text-[10px] font-semibold block ${isSelected ? role.accent : 'text-slate-400'}`}>
                                {role.badge}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-tight">
                          {role.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Mobile Number (Phone Only) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">2</span>
                    <span>Enter Mobile Number</span>
                  </label>
                  <span className="text-[11px] text-emerald-600 font-semibold">Phone number only • No password</span>
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center rounded-2xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 bg-white shadow-inner">
                    <span className="px-4 py-3.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                      <span className="text-base">🇮🇳</span>
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
                      placeholder="Enter 10-digit phone number"
                      className="w-full p-3.5 text-base font-mono font-bold tracking-wider text-slate-900 focus:outline-none bg-transparent"
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-rose-500 font-medium mt-1.5">{error}</p>
                  )}
                </div>

                {/* 1-Click Quick Preset Chips */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    1-Click Demo Profiles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ROLES.map(r => (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => handleRoleSelect(r.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition border flex items-center space-x-1 ${
                          selectedRole === r.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{r.defaultName}</span>
                        <span className="opacity-60 text-[10px]">({r.title.split(' ')[0]})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full group flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>
                  {isSignUp 
                    ? 'Create Ksquare Account & Enter Dashboard' 
                    : `Enter Dashboard as ${activeRoleObj?.title.split(' ')[0]}`
                  }
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Security & Trust Footer */}
              <div className="flex items-center justify-center space-x-4 text-xs text-slate-400 pt-1">
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Platform</span>
                </div>
                <span>•</span>
                <span>Instant UPI Payouts</span>
                <span>•</span>
                <span>100% Traceable</span>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
