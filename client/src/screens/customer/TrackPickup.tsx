import React, { useState } from 'react';
import { PickupRequest, PickupStatus, DigitalReceipt } from '../../types';
import { api } from '../../services/api';
import { MapPicker } from '../../components/MapPicker';
import { DigitalReceiptModal } from '../../components/DigitalReceiptModal';
import { Check, Phone, ArrowRight, ShieldCheck, Sparkles, RefreshCw, FileText } from 'lucide-react';

interface Props {
  pickup: PickupRequest | null;
  onRefresh: () => void;
  onSwitchToCollector: () => void;
}

const STEPS: { status: PickupStatus; label: string; description: string }[] = [
  { status: 'requested', label: 'Requested', description: 'Matched with nearest collector' },
  { status: 'accepted', label: 'Accepted', description: 'Collector confirmed your request' },
  { status: 'on_the_way', label: 'On The Way', description: 'Collector is en route to your address' },
  { status: 'collected', label: 'Collected', description: 'Digital weighing in progress' },
  { status: 'completed', label: 'Completed', description: 'Receipt generated & paid' }
];

export const TrackPickup: React.FC<Props> = ({
  pickup,
  onRefresh,
  onSwitchToCollector
}) => {
  const [receiptModal, setReceiptModal] = useState<DigitalReceipt | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  if (!pickup) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 max-w-lg mx-auto">
        <p className="font-semibold text-slate-700">No active pickup selected</p>
        <p className="text-xs mt-1">Please book a pickup or choose one from your history.</p>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex(s => s.status === pickup.status);

  // Demo helper: allows 1-click step advancement directly for fast hackathon demo
  const handleAdvanceSimulation = async () => {
    setIsSimulating(true);
    try {
      if (pickup.status === 'requested') {
        await api.updatePickupStatus(pickup.id, 'accepted', 'col-1', 'Collector accepted pickup');
      } else if (pickup.status === 'accepted') {
        await api.updatePickupStatus(pickup.id, 'on_the_way', undefined, 'Collector is on the way');
      } else if (pickup.status === 'on_the_way') {
        // Run digital weigh & complete
        const res = await api.weighAndCompletePickup(pickup.id, pickup.estimatedWeight + 0.5, 'Instant UPI');
        setReceiptModal(res.receipt);
      }
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleOpenReceipt = async () => {
    if (pickup.receiptId) {
      const r = await api.getReceipt(pickup.receiptId);
      setReceiptModal(r);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Pickup #{pickup.id}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Live Collection Tracking
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {pickup.status === 'completed' && (
            <button
              onClick={handleOpenReceipt}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow hover:bg-emerald-700 transition"
            >
              <FileText className="w-4 h-4" />
              <span>View Receipt</span>
            </button>
          )}

          {pickup.status !== 'completed' && (
            <button
              onClick={handleAdvanceSimulation}
              disabled={isSimulating}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-xs hover:bg-indigo-100 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate Next Step</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Step Progress Stepper */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="grid grid-cols-5 gap-2 relative">
          {STEPS.map((step, idx) => {
            const isDone = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.status} className="flex flex-col items-center text-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition ${
                    isDone 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                      : 'bg-slate-100 text-slate-400'
                  } ${isCurrent ? 'ring-4 ring-emerald-500/20 animate-pulse' : ''}`}
                >
                  {isDone ? <Check className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`text-xs font-bold mt-2 ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.label}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5 leading-tight">
                  {step.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Map & Collector Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MapPicker 
            customerCoords={{ lat: pickup.location.lat, lng: pickup.location.lng }}
            collectorCoords={{ lat: 28.4720, lng: 77.0360 }}
            collectorName={pickup.collectorName || 'Ramesh Kumar'}
            height="360px"
          />
        </div>

        <div className="lg:col-span-5 space-y-4">
          {/* Collector Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Collector
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base">{pickup.collectorName || 'Ramesh Kumar'}</h4>
                <p className="text-xs text-slate-500">Electric Cargo Loader • 4.9★</p>
              </div>
              <a
                href={`tel:${pickup.collectorPhone || '+919811122334'}`}
                className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Material:</span>
                <span className="font-semibold text-slate-800 uppercase">{pickup.materialCategory}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Quantity:</span>
                <span className="font-semibold text-slate-800">{pickup.estimatedWeight} kg</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Indicative Value:</span>
                <span className="font-semibold text-emerald-600">₹{pickup.totalValue}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onSwitchToCollector}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <span>Switch to Collector View to Process</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DigitalReceiptModal 
        receipt={receiptModal} 
        onClose={() => setReceiptModal(null)} 
      />
    </div>
  );
};