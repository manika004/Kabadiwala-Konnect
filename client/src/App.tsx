import React, { useState, useEffect } from 'react';
import { UserRole, PickupRequest, RateItem, MaterialCategory, AIClassificationResult } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';

// Customer screens
import { CustomerHome } from './screens/customer/CustomerHome';
import { WasteScan } from './screens/customer/WasteScan';
import { RequestPickup } from './screens/customer/RequestPickup';
import { TrackPickup } from './screens/customer/TrackPickup';
import { CustomerHistory } from './screens/customer/CustomerHistory';

// Collector screens
import { CollectorDashboard } from './screens/collector/CollectorDashboard';
import { WeighComplete } from './screens/collector/WeighComplete';
import { CollectorEarnings } from './screens/collector/CollectorEarnings';

// Recycler screen
import { RecyclerDashboard } from './screens/recycler/RecyclerDashboard';

// Admin screen
import { AdminDashboard } from './screens/admin/AdminDashboard';

// Icons
import { Home, Camera, Calendar, MapPin, History, LayoutDashboard, Scale, DollarSign } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [customerTab, setCustomerTab] = useState<'home' | 'scan' | 'request' | 'track' | 'history'>('home');
  const [collectorTab, setCollectorTab] = useState<'dashboard' | 'weigh' | 'earnings'>('dashboard');

  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [rates, setRates] = useState<RateItem[]>([]);
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [prefilledCategory, setPrefilledCategory] = useState<MaterialCategory>('cardboard');

  const refreshData = async () => {
    try {
      const [fetchedPickups, fetchedRates] = await Promise.all([
        api.getPickups(),
        api.getRates()
      ]);
      setPickups(fetchedPickups);
      setRates(fetchedRates);

      // Keep selected pickup in sync
      if (selectedPickup) {
        const updated = fetchedPickups.find(p => p.id === selectedPickup.id);
        if (updated) setSelectedPickup(updated);
      } else if (fetchedPickups.length > 0) {
        // Default to first active or first recent
        const active = fetchedPickups.find(p => p.status !== 'completed');
        setSelectedPickup(active || fetchedPickups[0]);
      }
    } catch (e) {
      console.error('Error refreshing app data:', e);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleResetDemo = async () => {
    if (confirm('Reset demo state to initial test data?')) {
      await api.resetDemo();
      await refreshData();
      setCurrentRole('customer');
      setCustomerTab('home');
    }
  };

  // When user scans waste and clicks "Book Pickup with this Waste"
  const handleProceedToBooking = (classification: AIClassificationResult) => {
    setPrefilledCategory(classification.category);
    setCustomerTab('request');
  };

  // When a pickup is created
  const handlePickupCreated = (newPickup: PickupRequest) => {
    setSelectedPickup(newPickup);
    refreshData();
    setCustomerTab('track');
  };

  const activePickupsCount = pickups.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar 
        currentRole={currentRole}
        onSelectRole={(role) => setCurrentRole(role)}
        activePickupCount={activePickupsCount}
        onResetDemo={handleResetDemo}
      />

      {/* Role Sub-Navigation (if customer or collector) */}
      {currentRole === 'customer' && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-2 sm:space-x-4 py-2 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setCustomerTab('home')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                  customerTab === 'home'
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              <button
                onClick={() => setCustomerTab('scan')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                  customerTab === 'scan'
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>AI Waste Scan</span>
              </button>

              <button
                onClick={() => setCustomerTab('request')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                  customerTab === 'request'
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Request Pickup</span>
              </button>

              <button
                onClick={() => setCustomerTab('track')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                  customerTab === 'track'
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Live Tracking</span>
                {activePickupsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </button>

              <button
                onClick={() => setCustomerTab('history')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                  customerTab === 'history'
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History & Receipts</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {currentRole === 'collector' && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-2 sm:space-x-4 py-2 text-xs font-semibold">
              <button
                onClick={() => setCollectorTab('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                  collectorTab === 'dashboard'
                    ? 'bg-blue-50 text-blue-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Pickup Feed & Routes</span>
              </button>

              <button
                onClick={() => setCollectorTab('earnings')}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition ${
                  collectorTab === 'earnings'
                    ? 'bg-blue-50 text-blue-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Earnings & Trips</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Screen Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Experience */}
        {currentRole === 'customer' && (
          <>
            {customerTab === 'home' && (
              <CustomerHome 
                onNavigate={(t) => setCustomerTab(t as any)}
                activePickups={pickups}
                rates={rates}
                onSelectPickup={(p) => {
                  setSelectedPickup(p);
                  setCustomerTab('track');
                }}
              />
            )}
            {customerTab === 'scan' && (
              <WasteScan 
                onProceedToBooking={handleProceedToBooking}
              />
            )}
            {customerTab === 'request' && (
              <RequestPickup 
                initialMaterial={prefilledCategory}
                rates={rates}
                onPickupCreated={handlePickupCreated}
              />
            )}
            {customerTab === 'track' && (
              <TrackPickup 
                pickup={selectedPickup}
                onRefresh={refreshData}
                onSwitchToCollector={() => {
                  setCurrentRole('collector');
                  setCollectorTab('dashboard');
                }}
              />
            )}
            {customerTab === 'history' && (
              <CustomerHistory 
                pickups={pickups}
                onSelectPickup={(p) => {
                  setSelectedPickup(p);
                  setCustomerTab('track');
                }}
              />
            )}
          </>
        )}

        {/* Collector Experience */}
        {currentRole === 'collector' && (
          <>
            {collectorTab === 'dashboard' && (
              <CollectorDashboard 
                pickups={pickups}
                onRefresh={refreshData}
                onSelectWeigh={(p) => {
                  setSelectedPickup(p);
                  setCollectorTab('weigh');
                }}
              />
            )}
            {collectorTab === 'weigh' && selectedPickup && (
              <WeighComplete 
                pickup={selectedPickup}
                rates={rates}
                onBack={() => setCollectorTab('dashboard')}
                onCompleted={() => {
                  refreshData();
                  setCollectorTab('dashboard');
                }}
              />
            )}
            {collectorTab === 'earnings' && (
              <CollectorEarnings />
            )}
          </>
        )}

        {/* Recycler Experience */}
        {currentRole === 'recycler' && (
          <RecyclerDashboard />
        )}

        {/* Admin Experience */}
        {currentRole === 'admin' && (
          <AdminDashboard 
            rates={rates}
            onRatesUpdated={refreshData}
            pickups={pickups}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Kabadiwala Connect — Circular Economy Platform MVP</span>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Computer Vision AI</span>
            <span>•</span>
            <span>Smart Haversine Routing</span>
            <span>•</span>
            <span>Digital Receipts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}