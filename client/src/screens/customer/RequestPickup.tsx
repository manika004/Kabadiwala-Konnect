import React, { useState, useEffect } from 'react';
import { MaterialCategory, RateItem, MatchedCollector, PickupRequest, AuthUser } from '../../types';
import { api } from '../../services/api';
import { MapPicker } from '../../components/MapPicker';
import { 
  Calendar, 
  MapPin, 
  Truck, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Award, 
  FileText,
  TrendingUp,
  Scale
} from 'lucide-react';

interface Props {
  initialMaterial?: MaterialCategory;
  rates: RateItem[];
  isInstitutionUser?: boolean;
  authUser?: AuthUser | null;
  onPickupCreated: (pickup: PickupRequest) => void;
}

const BULK_WEIGHT_PRESETS = [
  { label: '250 kg (Quarter Tonne)', value: 250 },
  { label: '500 kg (Half Tonne)', value: 500 },
  { label: '1,000 kg (1 Tonne • Mini-Truck)', value: 1000 },
  { label: '2,500 kg (2.5 Tonnes)', value: 2500 },
  { label: '5,000 kg+ (Commercial Carrier)', value: 5000 },
];

export const RequestPickup: React.FC<Props> = ({
  initialMaterial = 'cardboard',
  rates,
  isInstitutionUser = false,
  authUser,
  onPickupCreated
}) => {
  // Mode: Household vs Bulk Institutional
  const [isBulkOrder, setIsBulkOrder] = useState<boolean>(isInstitutionUser);
  
  // Organization Fields
  const [orgName, setOrgName] = useState<string>(
    authUser?.name?.includes('University') ? authUser.name : 'Amity University Campus'
  );
  const [orgType, setOrgType] = useState<string>('University / College Campus');
  const [billingGst, setBillingGst] = useState<string>('07AAAAA0000A1Z5');
  const [vehicleRequired, setVehicleRequired] = useState<string>('Tata Ace (1.5T) + 2 Verified Loaders');
  const [esgCertificateRequested, setEsgCertificateRequested] = useState<boolean>(true);
  const [pickupFrequency, setPickupFrequency] = useState<string>('One-Time Campus Drive');

  // Scrap Details
  const [material, setMaterial] = useState<MaterialCategory>(initialMaterial);
  const [estimatedWeight, setEstimatedWeight] = useState<number>(isInstitutionUser ? 500 : 15);
  const [location, setLocation] = useState({
    address: isInstitutionUser 
      ? 'Amity University Academic Block 4, Sector 125, Gurugram' 
      : 'Flat 402, Green Meadows Apt, Sector 14, Gurugram',
    lat: 28.4682,
    lng: 77.0321
  });
  const [preferredTime, setPreferredTime] = useState<string>('Tomorrow, 10:00 AM - 1:00 PM');
  const [notes, setNotes] = useState<string>(
    isInstitutionUser 
      ? 'Loading dock access available at Gate 2. Digital crane scale required.' 
      : 'Scrap sorted in boxes in basement'
  );
  const [matchedCollectors, setMatchedCollectors] = useState<MatchedCollector[]>([]);
  const [selectedCollectorId, setSelectedCollectorId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Re-query matching collectors
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

  const baseRate = rates.find(r => r.category === material)?.ratePerKg || 15;
  // +10% bulk bonus rate for orders >= 200kg
  const effectiveRate = isBulkOrder ? Math.round(baseRate * 1.1) : baseRate;
  const estimatedPayout = Math.round(estimatedWeight * effectiveRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.createPickup({
        customerId: authUser?.id || (isBulkOrder ? 'user-inst-1' : 'user-cust-1'),
        customerName: isBulkOrder ? orgName : (authUser?.name || 'Aarav Sharma'),
        customerPhone: authUser?.phone || '+91 98765 43210',
        materialCategory: material,
        estimatedWeight,
        location,
        preferredTime,
        notes: isBulkOrder 
          ? `[BULK ORDER - ${orgType}] ${notes} | Vehicle: ${vehicleRequired} | ESG Cert: ${esgCertificateRequested ? 'YES' : 'NO'}`
          : notes,
        collectorId: selectedCollectorId,
        isBulkOrder,
        organizationName: isBulkOrder ? orgName : undefined,
        institutionType: isBulkOrder ? orgType : undefined,
        vehicleRequired: isBulkOrder ? vehicleRequired : undefined,
        esgCertificateRequested: isBulkOrder ? esgCertificateRequested : undefined,
        billingGst: isBulkOrder ? billingGst : undefined
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
      
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isBulkOrder ? 'Institutional & University Bulk Scrap Order' : 'Request Doorstep Scrap Pickup'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isBulkOrder 
              ? 'Schedule high-volume commercial recycling (250kg - 10+ tonnes) with heavy fleet logistics & ESG certification.'
              : 'Select your scrap materials, choose a time window, and get paired with a nearby vetted Kabadiwala.'
            }
          </p>
        </div>

        {/* Mode Switcher Pill */}
        <div className="flex bg-slate-200/70 p-1 rounded-2xl shrink-0 border border-slate-300/60">
          <button
            type="button"
            onClick={() => {
              setIsBulkOrder(false);
              setEstimatedWeight(15);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              !isBulkOrder 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏠 Household
          </button>
          <button
            type="button"
            onClick={() => {
              setIsBulkOrder(true);
              setEstimatedWeight(500);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
              isBulkOrder 
                ? 'bg-[#124b38] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>🏢 Bulk / Campus</span>
          </button>
        </div>
      </div>

      {/* Bulk Institution Banner (when in Bulk Mode) */}
      {isBulkOrder && (
        <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-amber-900">
            <GraduationCap className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="font-extrabold text-sm sm:text-base">Institutional Enterprise Guarantee</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 font-bold text-[10px] tracking-wide uppercase">
              +10% Bulk Bonus
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Tailored for universities, engineering campuses, corporate IT parks, and schools. Includes dedicated heavy loading vehicle dispatch, verified loading crew, certified on-site digital crane scales, and an official <strong>ESG / NAAC Green Sustainability Dossier</strong>.
          </p>
          <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-semibold text-slate-600">
            <span className="flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full GST Invoicing</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Confidential Shredding / E-Waste Audits</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Bank NEFT / Instant UPI</span>
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Material Category */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Select Primary Waste Category
            </label>
            {isBulkOrder && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Bulk Bonus: +10% higher payout
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {rates.map(r => {
              const rPerKg = isBulkOrder ? Math.round(r.ratePerKg * 1.1) : r.ratePerKg;
              return (
                <button
                  type="button"
                  key={r.category}
                  onClick={() => setMaterial(r.category)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition ${
                    material === r.category
                      ? 'border-[#124b38] bg-[#f4f9f4] shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    {r.category.replace('_', ' ')}
                  </span>
                  <span className="text-base font-extrabold text-slate-900 block mt-0.5">
                    ₹{rPerKg}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    per kg {isBulkOrder ? '(Bulk)' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Weight Specification (Household vs Bulk Presets) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Estimated Scrap Weight (kg)
          </label>

          {isBulkOrder ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {BULK_WEIGHT_PRESETS.map(preset => (
                  <button
                    type="button"
                    key={preset.value}
                    onClick={() => setEstimatedWeight(preset.value)}
                    className={`p-3 rounded-xl border text-left font-bold text-xs transition flex items-center justify-between ${
                      estimatedWeight === preset.value
                        ? 'border-[#124b38] bg-[#f4f9f4] text-[#124b38] shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {estimatedWeight === preset.value && (
                      <Check className="w-3.5 h-3.5 text-[#124b38]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <span className="text-xs text-slate-500 font-semibold">Or exact weight:</span>
                <input
                  type="number"
                  min={100}
                  step={50}
                  value={estimatedWeight}
                  onChange={(e) => setEstimatedWeight(Math.max(100, Number(e.target.value)))}
                  className="w-36 p-2 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#124b38]"
                />
                <span className="text-xs text-slate-400 font-medium">kg</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input 
                type="range" 
                min={2} 
                max={150} 
                step={1}
                value={estimatedWeight}
                onChange={(e) => setEstimatedWeight(Number(e.target.value))}
                className="w-full accent-[#124b38]"
              />
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400">Min: 2 kg</span>
                <span className="text-xl font-black text-[#124b38]">{estimatedWeight} kg</span>
                <span className="text-slate-400">Max: 150 kg</span>
              </div>
            </div>
          )}

          {/* Value Estimation Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Estimated Instant Payout</span>
              <span className="text-xs text-slate-400">
                ₹{effectiveRate}/kg × {estimatedWeight} kg {isBulkOrder ? '(includes bulk bonus)' : ''}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-emerald-700">₹{estimatedPayout.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 block">Verified on physical scale</span>
            </div>
          </div>
        </div>

        {/* Step 3: Institutional Details (Only if Bulk Order) */}
        {isBulkOrder && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Organization & Campus Credentials
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Organization / Campus Name</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Amity University Campus"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#124b38] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Institution Type</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#124b38] focus:outline-none bg-white"
                >
                  <option>University / College Campus</option>
                  <option>Corporate Office / IT Park</option>
                  <option>School / Educational Institute</option>
                  <option>Hospital / Medical Center</option>
                  <option>Industrial Warehouse / Factory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Dedicated Heavy Fleet</label>
                <select
                  value={vehicleRequired}
                  onChange={(e) => setVehicleRequired(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#124b38] focus:outline-none bg-white"
                >
                  <option>Tata Ace (1.5 Tonne) + 2 Verified Loaders</option>
                  <option>Heavy Electric Cargo Truck (3-5 Tonnes) + Crew</option>
                  <option>Multi-Axle Tipper (10+ Tonnes) + Crane Scale</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">GSTIN (Optional for tax invoice)</label>
                <input
                  type="text"
                  value={billingGst}
                  onChange={(e) => setBillingGst(e.target.value)}
                  placeholder="07AAAAA0000A1Z5"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-mono font-medium focus:ring-2 focus:ring-[#124b38] focus:outline-none"
                />
              </div>
            </div>

            {/* ESG Green Certificate Toggle */}
            <div className="pt-2">
              <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esgCertificateRequested}
                  onChange={(e) => setEsgCertificateRequested(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#124b38] accent-[#124b38]"
                />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    Generate Official ESG Green Recycling Certificate
                  </span>
                  <span className="text-[11px] text-emerald-700 leading-tight block mt-0.5">
                    Includes certified diversion metrics (kg recycled, trees saved, CO₂ offset) formatted for University NAAC accreditation and corporate sustainability reports.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Address & Location */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            {isBulkOrder ? '4' : '3'}. Campus / Pickup Location
          </label>
          <input
            type="text"
            required
            value={location.address}
            onChange={(e) => setLocation({ ...location, address: e.target.value })}
            placeholder="Enter full campus address / gate number"
            className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#124b38] focus:outline-none"
          />
          <MapPicker 
            customerCoords={{ lat: location.lat, lng: location.lng }}
            onLocationSelect={(coords) => setLocation(prev => ({ ...prev, ...coords }))}
            height="260px"
          />
        </div>

        {/* Step 5: Schedule & Special Access Notes */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            {isBulkOrder ? '5' : '4'}. Preferred Schedule & Gate Access
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Time Window</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#124b38] focus:outline-none bg-white"
              >
                <option>Today, 3:00 PM - 5:00 PM</option>
                <option>Tomorrow, 10:00 AM - 1:00 PM (Recommended for bulk)</option>
                <option>Tomorrow, 2:00 PM - 5:00 PM</option>
                <option>Saturday Morning (Campus Weekend Drive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Gate Access & Instructions</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Gate 2 loading dock, security clearance arranged"
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#124b38] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-[#124b38] hover:bg-[#0c3628] text-white font-bold text-base shadow-xl shadow-[#124b38]/20 transition flex items-center justify-center space-x-2"
        >
          <span>
            {isSubmitting 
              ? 'Dispatching Heavy Logistics...' 
              : isBulkOrder 
                ? `Confirm Bulk Order (${estimatedWeight.toLocaleString()} kg • ₹${estimatedPayout.toLocaleString()}) ➔`
                : 'Confirm Household Doorstep Pickup ➔'
            }
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>
    </div>
  );
};
