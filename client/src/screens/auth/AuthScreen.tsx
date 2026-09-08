import React, { useState } from 'react';
import { UserRole, AuthUser } from '../../types';
import { 
  Home, 
  Truck, 
  Factory, 
  ShieldCheck, 
  Compass, 
  ArrowRight,
  Sparkles,
  Phone
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

const ROLES: {
  id: UserRole;
  category: string;
  title: string;
  description: string;
  icon: typeof Home;
  iconBg: string;
  iconColor: string;
  defaultPhone: string;
  defaultName: string;
}[] = [
  {
    id: 'customer',
    category: 'HOUSEHOLD',
    title: 'I want to recycle',
    description: 'Book doorstep pickups and give your scrap a second life.',
    icon: Home,
    iconBg: 'bg-[#eef8f2]',
    iconColor: 'text-[#124b38]',
    defaultPhone: '9876543210',
    defaultName: 'Aarav Sharma'
  },
  {
    id: 'collector',
    category: 'KABADIWALA / COLLECTOR',
    title: "I'm a kabadiwala",
    description: 'Find nearby pickups, plan your day and record collections.',
    icon: Truck,
    iconBg: 'bg-[#fef4ea]',
    iconColor: 'text-[#f97316]',
    defaultPhone: '9811122334',
    defaultName: 'Ramesh Kumar'
  },
  {
    id: 'recycler',
    category: 'RECYCLER',
    title: 'I run a recycling business',
    description: 'Source recyclable materials and manage incoming batches.',
    icon: Factory,
    iconBg: 'bg-[#eff6ff]',
    iconColor: 'text-[#3b82f6]',
    defaultPhone: '9844455667',
    defaultName: 'EcoCycle Aggregators'
  },
  {
    id: 'admin',
    category: 'ADMIN',
    title: 'Manage the network',
    description: 'Owner workspace for material rates, members and transactions.',
    icon: ShieldCheck,
    iconBg: 'bg-[#f5f3ff]',
    iconColor: 'text-[#8b5cf6]',
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

    const activeObj = ROLES.find(r => r.id === selectedRole);
    const user: AuthUser = {
      id: 'user-' + selectedRole + '-' + cleanPhone.slice(-4),
      name: name.trim() || activeObj?.defaultName || 'User',
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
    <div className="min-h-screen w-full bg-[#124b38] flex flex-col lg:flex-row">
      
      {/* ================= LEFT EDITORIAL HERO PANEL ================= */}
      <div className="lg:w-[45%] xl:w-[42%] bg-[#124b38] text-white flex flex-col justify-start relative overflow-hidden p-8 sm:p-10 lg:p-12 xl:p-14 space-y-8 sm:space-y-10">
        
        {/* K² / Ksquare Brand Header at the Top */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white p-1.5 shrink-0 shadow-xl border border-white/20">
            <img 
              src="/logo.jpg" 
              alt="Ksquare K² Logo" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">Ksquare</span>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white font-extrabold text-xs tracking-wider shadow-sm">K²</span>
            </div>
            <p className="text-xs font-semibold text-[#9fe3be] uppercase tracking-wider">
              Turning Waste into Tomorrow
            </p>
            <div className="flex items-center space-x-1.5 text-white/80 text-[10px] font-bold tracking-widest uppercase pt-0.5">
              <Compass className="w-3 h-3 text-emerald-300" />
              <span>NOTHING GOOD GOES TO WASTE</span>
            </div>
          </div>
        </div>

        {/* Text Content Aligned Below K² */}
        <div className="space-y-6">
          {/* Headline with Editorial Serif Accent */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.08]">
              New beginnings.
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.08]">
              For you.
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#9fe3be] leading-[1.08] font-['Instrument_Serif',serif] italic pt-1">
              For your scrap.
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-white/80 text-sm sm:text-base font-normal leading-relaxed max-w-md">
            A cleaner home. A stronger local community.<br />
            A second life for the things you leave behind.
          </p>

          {/* Tagline */}
          <p className="text-xs text-emerald-200/70 tracking-wider uppercase font-medium pt-1">
            Waste • People • Possibilities • Connected
          </p>
        </div>

      </div>

      {/* ================= RIGHT INTERACTIVE AUTH PANEL ================= */}
      <div className="lg:w-[55%] xl:w-[58%] bg-white flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16">
        <div className="w-full max-w-xl space-y-6">
          
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#124b38] tracking-tight">
                Welcome back.
              </h2>
            </div>
            <p className="text-slate-500 text-sm sm:text-base">
              Choose how you'd like to be part of the circle.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* The 4 Role Option Cards */}
            <div className="space-y-3">
              {ROLES.map(role => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`w-full p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'border-2 border-[#124b38] bg-[#f4f9f4] shadow-sm'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${role.iconBg} ${role.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Labels */}
                      <div className="text-left">
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          {role.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-tight mt-0.5">
                          {role.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                          {role.description}
                        </p>
                      </div>
                    </div>

                    {/* Radio Indicator */}
                    <div className="pl-3 shrink-0">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#124b38] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#124b38]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-slate-300 transition" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Auth Input Section */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Mobile Number Verification
                </span>
                <div className="flex space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`font-semibold transition ${!isSignUp ? 'text-[#124b38] underline' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Sign In
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`font-semibold transition ${isSignUp ? 'text-[#124b38] underline' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    New Sign Up
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#124b38] focus:outline-none"
                  />
                </div>
              )}

              {/* Phone Input */}
              <div>
                <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#124b38] bg-white">
                  <span className="px-4 py-3.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-700 flex items-center space-x-1.5 shrink-0">
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
                    className="w-full p-3.5 text-base font-mono font-bold tracking-wider text-slate-900 focus:outline-none bg-transparent"
                  />
                </div>
                {error && (
                  <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>
                )}
              </div>

              {/* 1-Click Demo Profiles */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                  1-Click Fill:
                </span>
                {ROLES.map(r => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => handleRoleSelect(r.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition border ${
                      selectedRole === r.id
                        ? 'bg-[#124b38] text-white border-[#124b38]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r.defaultName} ({r.category.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-[#124b38] hover:bg-[#0c3628] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#124b38]/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Continue as {activeRoleObj?.category.split(' ')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Footnote */}
            <div className="text-center text-xs text-slate-400">
              <span>Ksquare Platform • Turning Waste into Tomorrow</span>
            </div>
          </form>

        </div>
      </div>

    </div>
  );
};
