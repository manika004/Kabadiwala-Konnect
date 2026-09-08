import React, { useState, useEffect } from 'react';
import { DemoSample, AIClassificationResult } from '../../types';
import { api } from '../../services/api';
import { Camera, Upload, Sparkles, CheckCircle2, ArrowRight, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface Props {
  onProceedToBooking: (classification: AIClassificationResult, sampleUrl?: string) => void;
}

export const WasteScan: React.FC<Props> = ({ onProceedToBooking }) => {
  const [samples, setSamples] = useState<DemoSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<DemoSample | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [classification, setClassification] = useState<AIClassificationResult | null>(null);

  const LOCAL_SAMPLES: DemoSample[] = [
    {
      id: 'sample-cardboard',
      title: 'Corrugated Delivery Cartons',
      category: 'cardboard',
      imageUrl: '/samples/cardboard.jpeg',
      description: 'Amazon delivery packaging boxes and corrugated cardboard sheets'
    },
    {
      id: 'sample-paper',
      title: 'Old Newspapers & Study Books',
      category: 'paper',
      imageUrl: '/samples/paper.jpeg',
      description: 'Stacked daily newspapers, study guides, and white office printouts'
    },
    {
      id: 'sample-plastic',
      title: 'PET Mineral Water & Soda Bottles',
      category: 'plastic',
      imageUrl: '/samples/plastic.jpeg',
      description: 'Crushed and intact transparent PET plastic beverage bottles'
    },
    {
      id: 'sample-metal',
      title: 'Aluminum Soda Cans & Iron Scrap',
      category: 'metal',
      imageUrl: '/samples/metal.jpg',
      description: 'Empty beverage tins, aluminum cans, and minor metallic scraps'
    },
    {
      id: 'sample-glass',
      title: 'Glass Beverage & Sauce Bottles',
      category: 'glass',
      imageUrl: '/samples/glass.jpeg',
      description: 'Clean amber, green, and clear glass bottles and jars'
    },
    {
      id: 'sample-ewaste',
      title: 'Discarded Electronics & Motherboard',
      category: 'e_waste',
      imageUrl: '/samples/ewaste.jpeg',
      description: 'Dead circuit board, old smartphone, chargers, and ribbon cables'
    }
  ];

  useEffect(() => {
    api.getAISamples()
      .then(res => {
        const mapped = res.map(s => {
          const local = LOCAL_SAMPLES.find(l => l.id === s.id);
          return local ? { ...s, imageUrl: local.imageUrl } : s;
        });
        setSamples(mapped);
        if (mapped.length > 0) {
          handleSelectSample(mapped[0]);
        }
      })
      .catch(() => {
        setSamples(LOCAL_SAMPLES);
        handleSelectSample(LOCAL_SAMPLES[0]);
      });
  }, []);

  const handleSelectSample = async (sample: DemoSample) => {
    setSelectedSample(sample);
    setUploadedImage(null);
    setIsAnalyzing(true);
    try {
      const res = await api.classifyWaste({ sampleId: sample.id });
      setClassification(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploadedImage(base64);
      setSelectedSample(null);
      setIsAnalyzing(true);
      try {
        const res = await api.classifyWaste({ image: file.name + ' ' + base64.substring(0, 100) });
        setClassification(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Computer Vision Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Waste Identification
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Select a demo sample or upload any photo to classify paper, cardboard, plastic, metal, glass, or e-waste.
        </p>
      </div>

      {/* Demo Sample Presets */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          1-Click Demo Presets (Select to test AI Classification)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {samples.map(s => (
            <button
              key={s.id}
              onClick={() => handleSelectSample(s)}
              className={`relative rounded-2xl overflow-hidden border-2 text-left transition-all group ${
                selectedSample?.id === s.id
                  ? 'border-emerald-600 ring-4 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="h-24 w-full overflow-hidden bg-slate-100">
                <img 
                  src={s.imageUrl} 
                  alt={s.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-2.5">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 mb-1">
                  {s.category}
                </span>
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{s.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Image & AI Analysis Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Preview & Upload */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
              {uploadedImage || selectedSample ? (
                <img 
                  src={uploadedImage || selectedSample?.imageUrl} 
                  alt="Waste to scan" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No image loaded</p>
                </div>
              )}

              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                  <p className="text-xs font-semibold tracking-wider uppercase">Analyzing image features...</p>
                </div>
              )}
            </div>

            {/* Upload or Camera input */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                />
              </label>

              <span className="text-[11px] text-slate-400">
                Supports JPG, PNG, WebP
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Readout Card */}
        <div className="lg:col-span-7">
          {classification ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Category & Confidence Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {classification.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {(classification.confidence * 100).toFixed(0)}% Confidence
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">
                    {classification.detectedLabel}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sub-type: {classification.subType}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium block">Current Scrap Rate</span>
                  <div className="flex items-baseline justify-end space-x-1 mt-1">
                    <span className="text-3xl font-extrabold text-emerald-600">
                      ₹{classification.estimatedRatePerKg}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ kg</span>
                  </div>
                </div>
              </div>

              {/* Confidence Meter */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>AI Identification Confidence</span>
                  <span>{(classification.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${classification.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Inspection Attributes */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Recyclability</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{classification.recyclabilityRating}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Contamination</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{classification.keyAttributes.contaminationRisk}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Cleanliness</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{classification.keyAttributes.cleanliness}</span>
                </div>
              </div>

              {/* Collector Handling Tips */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Preparation Tips for Maximum Payout
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {classification.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Booking CTA Button */}
              <button
                onClick={() => onProceedToBooking(classification, uploadedImage || selectedSample?.imageUrl)}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5"
              >
                <span>Book Pickup with this Waste</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
              <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium text-sm text-slate-600">No Waste Item Scanned Yet</p>
              <p className="text-xs mt-1">Select one of the demo samples above to begin AI material identification.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};