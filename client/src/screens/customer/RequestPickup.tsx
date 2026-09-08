import React, { useState, useEffect } from 'react';
import { MaterialCategory, RateItem, MatchedCollector, PickupRequest } from '../../types';
import { api } from '../../services/api';
import { MapPicker } from '../../components/MapPicker';
import { Calendar, Clock, MapPin, Truck, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  initialMaterial?: MaterialCategory;
  rates: RateItem[];
  onPickupCreated: (pickup: PickupRequest) => void;
}

export const RequestPickup: React.FC<Props> = ({
  initialMaterial = 'cardboard',
  rates,
  onPickupCreated
}) => {
  const [material, setMaterial] = useState<MaterialCategory>(initialMaterial);
  const [estimatedWeight, setEstimatedWeight] = useState<number>(10);
  const [location, setLocation] = useState({
    address: 'Flat 402, Green Meadows Apt, Sector 14, Gurugram',
    lat: 28.4682,
    lng: 77.0321
  });
  const [preferredTime, setPreferredTime] = useState<string>('Today, 3:00 PM - 5:00 PM');
  const [notes, setNotes] = useState<string>('Scrap ready in bundled boxes');
  const [matchedCollectors, setMatchedCollectors] = useState<MatchedCollector[]>([]);
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Re-query matching collectors when coordinates or material change
  useEffect(() => {
    api.matchCollectors(location.lat, location.lng, material)
      .then(matches => {
        setMatchedCollectors(matches);
        if (matches.length > 0 && !selectedCollectorId) {
          setSelectedCollectorId(matches[0].collector.id);
        }
      })
      .catch(console.error);
  }, [location.lat, location.lng, material]);

  const currentRate = rates.find(r => r.category === material)?.ratePerKg || 15;
  const estimatedPayout = Math.round(estimatedWeight * currentRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.createPickup({
        customerId: 'user-cust-1',
        customerName: 'Aarav Sharma',
        customerPhone: '+91 98765 43210',
        materialCategory: material,
        estimatedWeight,
        location,
        preferredTime,
        notes,
        collectorId: selectedCollectorId
      });
      onPickupCreated(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to submit pickup request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Request Doorstep Scrap Pickup
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Select your scrap materials, choose a time window, and get paired with a nearby vetted Kabadiwala.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Material Selection */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Select Waste Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {rates.map(r => (
              <button
                type="button"
                key={r.category}
                onClick={() => setMaterial(r.category)}
                className={`p-3.5 rounded-2xl border-2 text-left transition ${
                  material === r.category
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  {r.category.replace('_', ' ')}
                </span>
                <span className="text-base font-bold text-slate-900 block mt-1">
                  ₹{r.ratePerKg}<span className="text-xs text-slate-500 font-normal">/kg</span>
                </span>
              </button>
            ))}
          </div>

          {/* Weight Slider */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-700">Approximate Quantity</span>
              <span className="text-lg font-bold text-emerald-600">{estimatedWeight} kg</span>
            </div>
            <input 
              type="range"
              min="2"
              max="100"
              step="1"
              value={estimatedWeight}
              onChange={(e) => setEstimatedWeight(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>2 kg (Small bag)</span>
              <span>25 kg</span>
              <span>50 kg</span>
              <span>100 kg (Bulk carton lot)</span>
            </div>

            {/* Indicative Value Bar */}
            <div className="mt-4 bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Estimated Transparent Value
                </span>
                <p className="text-xs text-emerald-700">
                  {estimatedWeight} kg × ₹{currentRate}/kg (final weight verified via digital scale)
                </p>
              </div>
              <span className="text-2xl font-extrabold text-emerald-700">
                ₹{estimatedPayout}
              </span>
            </div>
          </div>
        </div>

        {/* Step 2: Location & Interactive Map */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Pickup Address & Location
          </label>
          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <input 
              type="text"
              value={location.address}
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-none"
              placeholder="Enter apartment, street name, and sector"
            />
          </div>

          <MapPicker 
            customerCoords={{ lat: location.lat, lng: location.lng }}
            interactive={true}
            height="260px"
            onLocationSelect={(newCoords) => setLocation(newCoords)}
          />
        </div>

        {/* Step 3: Preferred Time Window */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            3. Preferred Pickup Slot
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              'Today, 10:00 AM - 12:00 PM',
              'Today, 3:00 PM - 5:00 PM',
              'Tomorrow, 10:00 AM - 1:00 PM'
            ].map(slot => (
              <button
                type="button"
                key={slot}
                onClick={() => setPreferredTime(slot)}
                className={`p-3.5 rounded-2xl border-2 text-left text-xs font-semibold transition ${
                  preferredTime === slot
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Clock className="w-4 h-4 mb-2 text-emerald-600" />
                {slot}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Additional Notes for Collector</label>
            <input 
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Ring flat bell 402, large cartons kept near balcony"
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Step 4: Proximity Matched Collectors */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Proximity Collector Recommendation
              </label>
              <p className="text-xs text-slate-500">Ranked by distance, rating, and accepted material categories</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {matchedCollectors.length} Collectors in Area
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matchedCollectors.map((match, idx) => (
              <div
                key={match.collector.id}
                onClick={() => setSelectedCollectorId(match.collector.id)}
                className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition relative ${
                  selectedCollectorId === match.collector.id
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {idx === 0 && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-600 text-white">
                    Best Match
                  </span>
                )}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{match.collector.name}</h4>
                    <p className="text-xs text-slate-500">{match.collector.vehicle}</p>
                    <div className="flex items-center space-x-2 mt-2 text-xs">
                      <span className="font-bold text-slate-700">{match.distanceKm} km away</span>
                      <span>•</span>
                      <span className="text-amber-600 font-semibold">{match.collector.rating}★</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">ETA ~{match.estimatedArrivalMinutes}m</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Dispatching Request...</span>
          ) : (
            <>
              <span>Confirm & Dispatch Pickup</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};