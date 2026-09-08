import React, { useState, useEffect } from 'react';
import { RecyclerStock, MaterialCategory } from '../../types';
import { api } from '../../services/api';
import { Factory, Package, ArrowUpRight, Send, CheckCircle2, TrendingUp, RefreshCw } from 'lucide-react';

export const RecyclerDashboard: React.FC = () => {
  const [stocks, setStocks] = useState<RecyclerStock[]>([]);
  const [dispatchModalCategory, setDispatchModalCategory] = useState<MaterialCategory | null>(null);
  const [dispatchWeight, setDispatchWeight] = useState<number>(50);
  const [destination, setDestination] = useState<string>('Century Paper & Pulp Mills');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  const loadStock = () => {
    api.getRecyclerStock().then(setStocks).catch(console.error);
  };

  useEffect(() => {
    loadStock();
    // Poll stock every 4 seconds to show live updates when pickups complete!
    const interval = setInterval(loadStock, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalStockKg = stocks.reduce((sum, s) => sum + s.currentStockKg, 0);
  const totalValuation = stocks.reduce((sum, s) => sum + s.estimatedValue, 0);

  const handleDispatch = async () => {
    if (!dispatchModalCategory) return;
    setIsDispatching(true);
    try {
      await api.dispatchStock(dispatchModalCategory, dispatchWeight, destination);
      setDispatchModalCategory(null);
      loadStock();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Factory className="w-4 h-4" />
            <span>Recycler Inventory & Processing Depot</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            EcoCycle Central Hub Inventory
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Auto-updated in real-time as Kabadiwalas complete digital weighing transactions.
          </p>
        </div>

        <button
          onClick={loadStock}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold hover:bg-purple-100 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Aggregate Stock KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Material In Depot</span>
          <div className="mt-2 text-4xl font-extrabold text-slate-900">{totalStockKg} kg</div>
          <span className="text-xs text-purple-600 font-semibold mt-1 inline-block">Baled & Ready for Industrial Processing</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Liquidity Value</span>
          <div className="mt-2 text-4xl font-extrabold text-emerald-600">₹{totalValuation}</div>
          <span className="text-xs text-slate-500 mt-1 inline-block">Valued at current admin indicative rates</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Supply Channels</span>
          <div className="mt-2 text-4xl font-extrabold text-blue-600">18</div>
          <span className="text-xs text-blue-600 font-semibold mt-1 inline-block">Local Kabadiwalas feeding scrap daily</span>
        </div>
      </div>

      {/* Material Stock Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Material Stock Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map(item => (
            <div key={item.category} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-purple-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{item.name}</h3>
                </div>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg">
                  ₹{item.unitRate}/kg
                </span>
              </div>

              {/* Stock Volume & Value */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Current Stock</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">{item.currentStockKg} kg</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium block">Holding Value</span>
                  <span className="text-lg font-extrabold text-emerald-600">₹{item.estimatedValue}</span>
                </div>
              </div>

              {/* Dispatch Action */}
              <button
                onClick={() => {
                  setDispatchModalCategory(item.category);
                  setDispatchWeight(Math.min(item.currentStockKg, 50));
                }}
                disabled={item.currentStockKg <= 0}
                className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-purple-200 text-purple-700 font-bold text-xs hover:bg-purple-50 transition disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch to Processing Factory</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Modal */}
      {dispatchModalCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Dispatch {dispatchModalCategory.toUpperCase()} Stock
            </h3>
            <p className="text-xs text-slate-500">
              Transfer sorted scrap lots to industrial recycling plants.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Dispatch Quantity (kg)</label>
              <input 
                type="number"
                value={dispatchWeight}
                onChange={(e) => setDispatchWeight(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Destination Facility</label>
              <input 
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setDispatchModalCategory(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatch}
                disabled={isDispatching}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-700 transition"
              >
                {isDispatching ? 'Dispatching...' : 'Confirm Dispatch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};