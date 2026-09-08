import React from 'react';
import { DigitalReceipt } from '../types';
import { CheckCircle, Download, Printer, X, Sparkles, ShieldCheck, TreePine, Droplet, Wind } from 'lucide-react';

interface Props {
  receipt: DigitalReceipt | null;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<Props> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-emerald-600 mb-3 shadow-md">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Verified Digital Receipt</h2>
          <p className="text-emerald-100 text-xs font-medium mt-1">Kabadiwala Connect • Transparent Recycling Network</p>
          <div className="inline-block mt-3 px-3 py-1 rounded-full bg-white/15 text-xs font-mono tracking-wider border border-white/20">
            {receipt.receiptNumber}
          </div>
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* Transaction Metadata */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-xs text-slate-500">
            <div>
              <span className="block text-slate-400 font-medium">Customer</span>
              <span className="font-semibold text-slate-800 text-sm">{receipt.customerName}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Collector (Kabadiwala)</span>
              <span className="font-semibold text-slate-800 text-sm">{receipt.collectorName}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Date & Time</span>
              <span className="font-semibold text-slate-800">{new Date(receipt.timestamp).toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-medium">Payment Method</span>
              <span className="inline-flex items-center font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {receipt.paymentMethod}
              </span>
            </div>
          </div>

          {/* Itemized Calculation */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Itemized Digital Weighing</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-medium">{receipt.materialName}</span>
                <span className="font-mono">{receipt.actualWeight} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Indicative Admin Rate</span>
                <span>₹{receipt.ratePerKg} / kg</span>
              </div>
              <div className="pt-3 mt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900 text-base">Net Cash Payout</span>
                <span className="font-extrabold text-emerald-600 text-xl">₹{receipt.totalPayout}</span>
              </div>
            </div>
          </div>

          {/* Environmental Impact Badges */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Environmental Divergence Impact</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                <Wind className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <div className="font-bold text-slate-800 text-xs">{receipt.environmentalImpact.co2SavedKg} kg</div>
                <div className="text-[10px] text-slate-500">CO₂ Avoided</div>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                <TreePine className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <div className="font-bold text-slate-800 text-xs">{receipt.environmentalImpact.treesSavedFraction > 0 ? receipt.environmentalImpact.treesSavedFraction : '0.1'}</div>
                <div className="text-[10px] text-slate-500">Trees Saved</div>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                <Droplet className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                <div className="font-bold text-slate-800 text-xs">{receipt.environmentalImpact.waterSavedLiters} L</div>
                <div className="text-[10px] text-slate-500">Water Saved</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button 
              onClick={() => window.print()}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition shadow-sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </button>
            <button 
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};