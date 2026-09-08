import React from 'react';
import { PickupRequest, RateItem } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { Camera, Calendar, ArrowRight, Sparkles, TrendingUp, ShieldCheck, Clock, MapPin, Building2, Award } from 'lucide-react';

interface Props {
  onNavigate: (tab: string) => void;
  activePickups: PickupRequest[];
  rates: RateItem[];
  onSelectPickup: (pickup: PickupRequest) => void;
}

export const CustomerHome: React.FC<Props> = ({
  onNavigate,
  activePickups,
  rates,
  onSelectPickup
}) => {
  const latestActive = activePickups.find(p => p.status !== 'completed' && p.status !== 'cancelled');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-sm border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI-Assisted Smart Scrap Pickup</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Turn household scrap into cash & divert waste from landfills.
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Snap a photo of your waste for instant AI material identification, get connected with vetted local Kabadiwalas, and receive guaranteed rates per kg.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('scan')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-emerald-800 font-bold text-sm shadow-md hover:bg-emerald-50 transition transform hover:-translate-y-0.5"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>AI Waste Scan</span>
            </button>
            <button
              onClick={() => onNavigate('request')}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600/60 hover:bg-emerald-600 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Direct Pickup</span>
            </button>
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-60 h-60 rounded-full bg-teal-400/15 blur-2xl pointer-events-none" />
      </div>

      {/* All Services & Options Hub */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">What would you like to do?</h2>
            <p className="text-xs text-slate-500">Access all scrap collection options directly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Option 1: Request Doorstep Pickup */}
          <div 
            onClick={() => onNavigate('request')}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#124b38] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                Request Pickup
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Schedule vetted doorstep scrap collection with digital scale weighing.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-emerald-700 space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Book pickup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Option 2: AI Waste Scanner */}
          <div 
            onClick={() => onNavigate('scan')}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition">
                  AI Waste Scan
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-100 text-blue-800">AI</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Snap or upload photos for instant scrap classification & estimated value.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-blue-700 space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Scan scrap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Option 3: Live Tracking */}
          <div 
            onClick={() => {
              if (latestActive) onSelectPickup(latestActive);
              onNavigate('track');
            }}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform relative">
                <MapPin className="w-6 h-6" />
                {latestActive && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition">
                Live Tracking
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {latestActive ? 'Active pickup assigned! Follow live route & ETA.' : 'Track assigned Kabadiwala location and route in real-time.'}
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-amber-700 space-x-1 group-hover:translate-x-1 transition-transform">
              <span>{latestActive ? 'Track active pickup' : 'Open live map'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Option 4: Bulk & Campus Collections */}
          <div 
            onClick={() => onNavigate('request')}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500 hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition">
                Bulk Collections
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                High-volume recycling (250kg - 10T+) for colleges, schools & IT parks.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-teal-700 space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Book bulk drive</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Pickup Alert Banner */}
      {latestActive && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-base">Active Pickup in Progress</span>
                <StatusBadge status={latestActive.status} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {latestActive.materialCategory.toUpperCase()} • ~{latestActive.estimatedWeight} kg • Matched Collector: <span className="font-semibold text-slate-700">{latestActive.collectorName || 'Searching...'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onSelectPickup(latestActive);
              onNavigate('track');
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition shrink-0"
          >
            <span>Live Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

            {/* Institutional & University Bulk Scrap Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-300/60 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-extrabold text-[10px] uppercase tracking-wider">
              Institutions & Universities
            </span>
            <span className="text-xs font-bold text-emerald-800">• Heavy Volume Fleet</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Placing large orders for your Campus, IT Park, or School?
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Schedule bulk pickups (250kg to 10+ tonnes) with dedicated heavy vehicle loaders, +10% bulk bonus rates, and official <strong>ESG / NAAC Green Sustainability Certificates</strong>.
          </p>
        </div>
        <button
          onClick={() => onNavigate('request')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#124b38] hover:bg-[#0c3628] text-white font-bold text-xs shadow-md transition shrink-0"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Book Bulk Campus Order</span>
        </button>
      </div>

      {/* Live Market Scrap Rates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Today's Verified Scrap Rates</h2>
            <p className="text-xs text-slate-500">Indicative rates established transparently by central recycling hub</p>
          </div>
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Updated Daily
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {rates.map(rate => (
            <div 
              key={rate.category}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition group cursor-pointer"
              onClick={() => onNavigate('request')}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {rate.category.replace('_', ' ')}
              </span>
              <div className="mt-2 flex items-baseline space-x-1">
                <span className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition">
                  ₹{rate.ratePerKg}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ kg</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {rate.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Value Proposition Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Computer Vision Scan</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Identifies paper, plastic, metal, and e-waste instantly with grade assessment.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Smart Proximity Matching</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Matches the nearest available collector in your sector to minimize waiting time.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Digital Weighing & Receipt</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Certified digital scale weight multiplied by clear rate/kg. Zero guesswork.</p>
          </div>
        </div>
      </div>
    </div>
  );
};