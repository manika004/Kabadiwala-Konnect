import React, { useState, useEffect } from 'react';
import { RateItem, User, PlatformAnalytics, PickupRequest, MaterialCategory } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Shield, TrendingUp, Users, DollarSign, TreePine, Wind, Save, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Props {
  rates: RateItem[];
  onRatesUpdated: () => void;
  pickups: PickupRequest[];
}

export const AdminDashboard: React.FC<Props> = ({
  rates,
  onRatesUpdated,
  pickups
}) => {
  const [activeTab, setActiveTab] = useState<'rates' | 'analytics' | 'transactions' | 'users'>('rates');
  const [editingRates, setEditingRates] = useState<Record<string, number>>({});
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(console.error);
    api.getUsers().then(setUsers).catch(console.error);
  }, [pickups]);

  const handleRateChange = (category: string, value: string) => {
    setEditingRates({
      ...editingRates,
      [category]: parseFloat(value) || 0
    });
  };

  const handleSaveRate = async (category: MaterialCategory) => {
    const newRate = editingRates[category];
    if (!newRate || newRate <= 0) return;

    try {
      await api.updateRate(category, newRate);
      onRatesUpdated();
      setSaveSuccess(`Updated rate for ${category} to ₹${newRate}/kg`);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (e) {
      console.error(e);
      alert('Failed to update rate');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center space-x-2 text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4" />
          <span>System Operations & Platform Oversight</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Admin Control Center
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Manage indicative scrap buy-rates, audit platform transactions, and monitor circular diversion metrics.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        {[
          { id: 'rates', label: 'Material Rates (₹/kg)' },
          { id: 'analytics', label: 'Circular Analytics' },
          { id: 'transactions', label: 'Transaction Audit' },
          { id: 'users', label: 'User Directory' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === t.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Tab 1: Rates Management */}
      {activeTab === 'rates' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Indicative Material Price Table</h3>
              <p className="text-xs text-slate-500">Changes immediately apply across all AI scans and digital scale calculations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rates.map(rate => {
              const currentEdit = editingRates[rate.category] ?? rate.ratePerKg;
              return (
                <div key={rate.category} className="p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {rate.category.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{rate.name}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">{rate.description}</p>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-500">₹</span>
                    <input 
                      type="number"
                      value={currentEdit}
                      onChange={(e) => handleRateChange(rate.category, e.target.value)}
                      className="w-24 p-2 rounded-xl border border-slate-200 text-sm font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-400">/ kg</span>

                    <button
                      onClick={() => handleSaveRate(rate.category)}
                      className="ml-auto p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
                      title="Save rate"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Circular Analytics */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Scrap Aggregated</span>
              <div className="mt-2 text-3xl font-extrabold text-slate-900">{analytics.totalWasteCollectedKg} kg</div>
              <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">100% Landfill Diverted</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Informal Payouts</span>
              <div className="mt-2 text-3xl font-extrabold text-emerald-600">₹{analytics.totalPayoutsINR}</div>
              <span className="text-xs text-slate-500 mt-1 inline-block">Direct economic value</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CO₂ Avoided</span>
              <div className="mt-2 text-3xl font-extrabold text-teal-700">{analytics.co2SavedTotalKg} kg</div>
              <span className="text-xs text-teal-600 font-semibold mt-1 inline-block">Calculated footprint offset</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Trees Equivalent Saved</span>
              <div className="mt-2 text-3xl font-extrabold text-green-700">{analytics.treesSavedTotal} Trees</div>
              <span className="text-xs text-green-600 font-semibold mt-1 inline-block">Via paper/carton pulping</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Transactions Audit */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h3 className="font-bold text-slate-900 text-base mb-4">Complete Pickup Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Pickup ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Collector</th>
                  <th className="py-3 px-4">Material</th>
                  <th className="py-3 px-4">Weight</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pickups.map(p => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-mono">{p.id}</td>
                    <td className="py-3 px-4 font-medium">{p.customerName}</td>
                    <td className="py-3 px-4">{p.collectorName || '—'}</td>
                    <td className="py-3 px-4 font-bold uppercase">{p.materialCategory}</td>
                    <td className="py-3 px-4 font-mono">{p.actualWeight || p.estimatedWeight} kg</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">₹{p.totalValue || '—'}</td>
                    <td className="py-3 px-4"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Users */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{u.name}</h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {u.role}
                  </span>
                </div>
                {u.isOnline !== undefined && (
                  <span className={`w-2.5 h-2.5 rounded-full ${u.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                )}
              </div>
              <p className="text-xs text-slate-500">{u.address}</p>
              <p className="text-xs font-mono text-slate-400">{u.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};