import React from 'react';
import { AuthUser } from '../types';
import { RefreshCw, User, Truck, Factory, Shield, LogOut, Building2 } from 'lucide-react';

interface NavbarProps {
  authUser: AuthUser | null;
  onLogout: () => void;
  activePickupCount: number;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  authUser,
  onLogout,
  activePickupCount,
  onResetDemo
}) => {
  const getRoleConfig = (role?: string) => {
    switch (role) {
      case 'institution':
        return {
          label: 'University / Campus',
          icon: Building2,
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
        };
      case 'collector':
        return {
          label: 'Kabadiwala',
          icon: Truck,
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'recycler':
        return {
          label: 'Recycler Hub',
          icon: Factory,
          badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      case 'admin':
        return {
          label: 'Central Admin',
          icon: Shield,
          badgeClass: 'bg-slate-800 text-white border-slate-700',
        };
      case 'customer':
      default:
        return {
          label: 'Household',
          icon: User,
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
    }
  };

  const roleConfig = getRoleConfig(authUser?.role);
  const RoleIcon = roleConfig.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Official Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-500/15 border border-emerald-100 bg-white p-0.5 shrink-0">
              <img 
                src="/logo.jpg" 
                alt="Ksquare Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  Ksquare
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  K²
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Turning Waste into Tomorrow
              </p>
            </div>
          </div>

          {/* Active Logged-In User Profile & Actions */}
          {authUser && (
            <div className="flex items-center space-x-3">
              {/* Active Role Badge */}
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${roleConfig.badgeClass}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{roleConfig.label}</span>
                {authUser.role === 'customer' && activePickupCount > 0 && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>

              {/* User Phone / Name (visible on desktop) */}
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800">{authUser.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{authUser.phone}</span>
              </div>

              {/* Switch View / Logout */}
              <button
                onClick={onLogout}
                title="Switch to another role or sign out to the login screen"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Switch Role</span>
              </button>

              {/* Reset Demo */}
              <button
                onClick={onResetDemo}
                title="Reset sample data for a fresh demo run"
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Reset Demo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
