import React, { useState, useEffect } from 'react';
import { PickupRequest, RouteGroup, User } from '../../types';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  Truck, 
  MapPin, 
  Check, 
  Navigation, 
  Scale, 
  Power, 
  Layers, 
  DollarSign, 
  Clock, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface Props {
  pickups: PickupRequest[];
  onRefresh: () => void;
  onSelectWeigh: (pickup: PickupRequest) => void;
}

export const CollectorDashboard: React.FC<Props> = ({
  pickups,
  onRefresh,
  onSelectWeigh
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [routeGroups, setRouteGroups] = useState<RouteGroup[]>([]);
  const [activeTab, setActiveTab] = useState<'requests' | 'active' | 'groups'>('requests');

  useEffect(() => {
    api.getGroupedRoutes().then(setRouteGroups).catch(console.error);
  }, [pickups]);

  const availableRequests = pickups.filter(p => p.status === 'requested');
  const activeTrips = pickups.filter(p => p.status === 'accepted' || p.status === 'on_the_way');

  const handleToggleOnline = async () => {
    const next = !isOnline;
    setIsOnline(next);
    await api.toggleCollectorOnline('col-1', next);
  };

  const handleAccept = async (id: string) => {
    await api.updatePickupStatus(id, 'accepted', 'col-1', 'Collector accepted pickup');
    onRefresh();
    setActiveTab('active');
  };

  const handleUpdateStatus = async (id: string, status: 'on_the_way') => {
    await api.updatePickupStatus(id, status, undefined, 'Collector is en route');
    onRefresh();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Collector Status Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">Ramesh Kumar</h2>
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-200">
                Electric Loader (EV-04)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Sector 14 & 17 Operational Zone • Rating: 4.9★</p>
          </div>
        </div>

        {/* Online Toggle */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-slate-600">
            {isOnline ? 'Active & Ready for Pickups' : 'Offline / On Break'}
          </span>
          <button
            onClick={handleToggleOnline}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              isOnline ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                isOnline ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Nearby Requests ({availableRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>In-Progress Pickups ({activeTrips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'groups'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Grouped Routes ({routeGroups.length})</span>
        </button>
      </div>

      {/* Tab Content: Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {availableRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              <Truck className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-slate-700">No new pending requests right now</p>
              <p className="text-xs mt-1">Switch to Customer role to submit a pickup request!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRequests.map(p => (
                <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-blue-300 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                        {p.materialCategory.replace('_', ' ')}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-2">{p.customerName}</h3>
                      <p className="text-xs text-slate-500 flex items-center mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                        {p.location.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Est. Value</span>
                      <span className="text-xl font-extrabold text-emerald-600">₹{p.totalValue}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs flex justify-between">
                    <div>
                      <span className="text-slate-400 block">Est. Weight</span>
                      <span className="font-bold text-slate-800">{p.estimatedWeight} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Rate / kg</span>
                      <span className="font-bold text-slate-800">₹{p.ratePerKg}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Preferred Slot</span>
                      <span className="font-bold text-slate-800">{p.preferredTime.split(',')[1] || p.preferredTime}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAccept(p.id)}
                    className="w-full flex items-center justify-center space-x-1.5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Pickup</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Active Pickups */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeTrips.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              <p className="font-semibold text-slate-700">No active pickups</p>
              <p className="text-xs mt-1">Accept a request from the "Nearby Requests" tab.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTrips.map(p => (
                <div key={p.id} className="bg-white rounded-3xl border-2 border-blue-500/30 p-5 shadow-md space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                          {p.materialCategory}
                        </span>
                        <StatusBadge status={p.status} />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-2">{p.customerName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{p.location.address}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Est. Payout</span>
                      <span className="text-lg font-bold text-emerald-600">₹{p.totalValue}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    {p.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(p.id, 'on_the_way')}
                        className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>I am On The Way</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectWeigh(p)}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <Scale className="w-4 h-4" />
                      <span>Digital Weigh & Complete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Route Grouping */}
      {activeTab === 'groups' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-800 leading-relaxed">
            <span className="font-bold">Smart Route Grouping:</span> Combines nearby household pickups within a 2.5 km radius so you can collect from multiple homes in a single eco-friendly trip, saving fuel and time.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routeGroups.map(grp => (
              <div key={grp.clusterId} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                    {grp.clusterName}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    Est. Earnings: ₹{Math.round(grp.estimatedEarnings)}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">{grp.pickups.length} Pickups in this neighborhood</p>
                  <p>Total Estimated Volume: <span className="font-bold">{grp.totalEstWeight} kg</span></p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Center: {grp.centerLat.toFixed(3)}, {grp.centerLng.toFixed(3)}</span>
                  <span className="text-blue-600 font-semibold">Optimized Path</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};