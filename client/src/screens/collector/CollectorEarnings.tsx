import React, { useState, useEffect } from 'react';
import { DigitalReceipt } from '../../types';
import { api } from '../../services/api';
import { DollarSign, TrendingUp, Package, Calendar, Award } from 'lucide-react';

export const CollectorEarnings: React.FC = () => {
  const [receipts, setReceipts] = useState<DigitalReceipt[]>([]);

  useEffect(() => {
    api.getReceipts().then(setReceipts).catch(console.error);
  }, []);

  const totalEarnings = receipts.reduce((sum, r) => sum + r.totalPayout, 0) + 2450;
  const totalWeight = receipts.reduce((sum, r) => sum + r.actualWeight, 0) + 180;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Collector Earnings & Trips
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Daily collection statistics, payout breakdown, and verified trip logs for Ramesh Kumar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
          <div className="mt-2 text-3xl font-extrabold text-blue-600">₹{totalEarnings}</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">Settled to bank via UPI</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scrap Aggregated</span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{totalWeight} kg</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Delivered to Recycler Depot</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Service Rating</span>
          <div className="mt-2 text-3xl font-extrabold text-amber-500">4.9 ★</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">Top Rated Kabadiwala in Zone</span>
        </div>
      </div>

      {/* Completed Receipts Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 text-base mb-4">Completed Collection Receipts</h3>
        <div className="space-y-3">
          {receipts.map(r => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">{r.customerName}</span>
                <p className="text-xs text-slate-500 mt-0.5">{r.materialName} • {r.actualWeight} kg</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-600">₹{r.totalPayout}</span>
                <span className="text-[10px] text-slate-400 block">{new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};