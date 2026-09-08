import React, { useState, useEffect } from 'react';
import { PickupRequest, DigitalReceipt } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { DigitalReceiptModal } from '../../components/DigitalReceiptModal';
import { FileText, Eye, TreePine, Wind, Droplet, ArrowUpRight } from 'lucide-react';

interface Props {
  pickups: PickupRequest[];
  onSelectPickup: (p: PickupRequest) => void;
}

export const CustomerHistory: React.FC<Props> = ({ pickups, onSelectPickup }) => {
  const [receipts, setReceipts] = useState<DigitalReceipt[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<DigitalReceipt | null>(null);

  useEffect(() => {
    api.getReceipts().then(setReceipts).catch(console.error);
  }, []);

  const totalEarnings = receipts.reduce((sum, r) => sum + r.totalPayout, 0);
  const totalWeight = receipts.reduce((sum, r) => sum + r.actualWeight, 0);
  const totalCo2 = receipts.reduce((sum, r) => sum + r.environmentalImpact.co2SavedKg, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Recycling History & Digital Receipts
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review completed pickups, verified digital receipts, and your cumulative environmental diversion.
        </p>
      </div>

      {/* Cumulative Eco Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Scrap Sold</span>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">{totalWeight} kg</div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">100% Diverted from Landfills</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Cash Earned</span>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600">₹{totalEarnings}</div>
          <span className="text-xs text-slate-500 font-semibold mt-1 inline-block">Direct UPI / Cash received</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">CO₂ Emissions Saved</span>
          <div className="mt-2 text-3xl font-extrabold text-teal-700">{totalCo2} kg</div>
          <span className="text-xs text-teal-600 font-semibold mt-1 inline-block">Equivalent to ~0.4 trees planted</span>
        </div>
      </div>

      {/* Transactions & Receipts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">All Transactions</h3>
          <span className="text-xs text-slate-400">{pickups.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">ID & Date</th>
                <th className="py-3.5 px-6">Material</th>
                <th className="py-3.5 px-6">Weight</th>
                <th className="py-3.5 px-6">Collector</th>
                <th className="py-3.5 px-6">Payout</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pickups.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-mono text-[11px] text-slate-500">
                    <div>{p.id}</div>
                    <div className="text-[10px] text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="py-4 px-6 font-bold uppercase text-slate-800">
                    {p.materialCategory.replace('_', ' ')}
                  </td>
                  <td className="py-4 px-6 font-mono">
                    {p.actualWeight || p.estimatedWeight} kg
                  </td>
                  <td className="py-4 px-6">
                    {p.collectorName || '—'}
                  </td>
                  <td className="py-4 px-6 font-bold text-emerald-600">
                    ₹{p.totalValue || '—'}
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    {p.receiptId ? (
                      <button
                        onClick={async () => {
                          const r = await api.getReceipt(p.receiptId!);
                          setActiveReceipt(r);
                        }}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectPickup(p)}
                        className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-600"
                      >
                        <span>Track</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DigitalReceiptModal 
        receipt={activeReceipt} 
        onClose={() => setActiveReceipt(null)} 
      />
    </div>
  );
};