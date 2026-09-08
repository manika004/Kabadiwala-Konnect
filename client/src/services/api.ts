import { 
  RateItem, 
  User, 
  PickupRequest, 
  PickupStatus, 
  DigitalReceipt, 
  RecyclerStock, 
  PlatformAnalytics, 
  DemoSample, 
  AIClassificationResult, 
  MatchedCollector,
  RouteGroup,
  MaterialCategory
} from '../types';

const API_BASE = '/api';

// Helper for local storage
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'API request failed');
  }
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // Rates
  getRates: async (): Promise<RateItem[]> => {
    try {
      const res = await fetch(`${API_BASE}/rates`);
      const data = await handleResponse<RateItem[]>(res);
      setLocal('kc_rates', data);
      return data;
    } catch (e) {
      return getLocal<RateItem[]>('kc_rates', [
        { category: 'cardboard', name: 'Cardboard & Cartons', ratePerKg: 14, unit: 'kg', description: 'Boxes', ecoBenefit: '17 trees/ton', co2FactorKg: 1.8 },
        { category: 'paper', name: 'Newspaper & Office Paper', ratePerKg: 12, unit: 'kg', description: 'Raddi', ecoBenefit: 'Saves water', co2FactorKg: 1.5 },
        { category: 'plastic', name: 'Rigid & Soft Plastics', ratePerKg: 18, unit: 'kg', description: 'Bottles', ecoBenefit: 'Saves landfill', co2FactorKg: 2.2 },
        { category: 'metal', name: 'Scrap Metals', ratePerKg: 32, unit: 'kg', description: 'Cans/iron', ecoBenefit: 'Saves bauxite', co2FactorKg: 4.5 },
        { category: 'glass', name: 'Glass Bottles & Jars', ratePerKg: 4, unit: 'kg', description: 'Cullet', ecoBenefit: '100% recyclable', co2FactorKg: 0.8 },
        { category: 'e_waste', name: 'Electronic Waste', ratePerKg: 45, unit: 'kg', description: 'E-Kachra', ecoBenefit: 'Precious metals', co2FactorKg: 6.0 }
      ]);
    }
  },
  updateRate: async (category: MaterialCategory, ratePerKg: number): Promise<RateItem> => {
    try {
      const res = await fetch(`${API_BASE}/rates/${category}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ratePerKg })
      });
      return await handleResponse<RateItem>(res);
    } catch (e) {
      const rates = getLocal<RateItem[]>('kc_rates', []);
      const r = rates.find(item => item.category === category);
      if (r) r.ratePerKg = ratePerKg;
      setLocal('kc_rates', rates);
      return r || { category, name: category, ratePerKg, unit: 'kg', description: '', ecoBenefit: '', co2FactorKg: 2 };
    }
  },

  // AI Classification
  getAISamples: async (): Promise<DemoSample[]> => {
    try {
      const res = await fetch(`${API_BASE}/ai/samples`);
      const data = await res.json();
      return data.samples;
    } catch (e) {
      return [
        { id: 'sample-cardboard', title: 'Corrugated Delivery Cartons', category: 'cardboard', imageUrl: '/samples/cardboard.jpeg', description: 'Amazon boxes' },
        { id: 'sample-paper', title: 'Old Newspapers & Study Books', category: 'paper', imageUrl: '/samples/paper.jpeg', description: 'Newspapers' },
        { id: 'sample-plastic', title: 'PET Mineral Water & Soda Bottles', category: 'plastic', imageUrl: '/samples/plastic.jpeg', description: 'Plastic bottles' },
        { id: 'sample-metal', title: 'Aluminum Soda Cans & Iron Scrap', category: 'metal', imageUrl: '/samples/metal.jpg', description: 'Cans' },
        { id: 'sample-glass', title: 'Glass Beverage & Sauce Bottles', category: 'glass', imageUrl: '/samples/glass.jpeg', description: 'Glass bottles' },
        { id: 'sample-ewaste', title: 'Discarded Electronics & Motherboard', category: 'e_waste', imageUrl: '/samples/ewaste.jpeg', description: 'Circuit board' }
      ];
    }
  },
  classifyWaste: async (params: { sampleId?: string; image?: string }): Promise<AIClassificationResult> => {
    try {
      const res = await fetch(`${API_BASE}/ai/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await handleResponse<AIClassificationResult>(res);
    } catch (e) {
      // Local fallback classification
      let cat: MaterialCategory = 'cardboard';
      if (params.sampleId) {
        if (params.sampleId.includes('paper')) cat = 'paper';
        else if (params.sampleId.includes('plastic')) cat = 'plastic';
        else if (params.sampleId.includes('metal')) cat = 'metal';
        else if (params.sampleId.includes('glass')) cat = 'glass';
        else if (params.sampleId.includes('ewaste')) cat = 'e_waste';
      }
      return {
        category: cat,
        categoryName: cat.replace('_', ' ').toUpperCase(),
        detectedLabel: cat.toUpperCase() + ' Waste',
        subType: 'Recyclable Grade A',
        confidence: 0.95,
        estimatedRatePerKg: 15,
        recyclabilityRating: 'High',
        tips: ['Ensure clean and dry before collection.'],
        keyAttributes: { cleanliness: 'Good', contaminationRisk: 'Low', dryWaste: true }
      };
    }
  },

  // Pickups
  getPickups: async (params?: { customerId?: string; collectorId?: string; status?: PickupStatus }): Promise<PickupRequest[]> => {
    const localPickups = getLocal<PickupRequest[]>('kc_pickups', []);
    try {
      const query = new URLSearchParams();
      if (params?.customerId) query.append('customerId', params.customerId);
      if (params?.collectorId) query.append('collectorId', params.collectorId);
      if (params?.status) query.append('status', params.status);
      const res = await fetch(`${API_BASE}/pickups?${query.toString()}`);
      const serverPickups = await handleResponse<PickupRequest[]>(res);
      
      // Merge server pickups with local pickups (local pickups take precedence for recently edited items)
      const mergedMap = new Map<string, PickupRequest>();
      serverPickups.forEach(p => mergedMap.set(p.id, p));
      localPickups.forEach(p => mergedMap.set(p.id, p)); // local updates override server
      const merged = Array.from(mergedMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setLocal('kc_pickups', merged);
      return merged;
    } catch (e) {
      return localPickups;
    }
  },
  getPickup: async (id: string): Promise<PickupRequest> => {
    const localPickups = getLocal<PickupRequest[]>('kc_pickups', []);
    const found = localPickups.find(p => p.id === id);
    if (found) return found;
    const res = await fetch(`${API_BASE}/pickups/${id}`);
    return handleResponse<PickupRequest>(res);
  },
  matchCollectors: async (lat: number, lng: number, material: MaterialCategory): Promise<MatchedCollector[]> => {
    try {
      const res = await fetch(`${API_BASE}/pickups/match?lat=${lat}&lng=${lng}&material=${material}`);
      return await handleResponse<MatchedCollector[]>(res);
    } catch (e) {
      return [
        {
          collector: {
            id: 'col-1',
            name: 'Ramesh Kumar',
            role: 'collector',
            phone: '+91 98111 22334',
            address: 'Sector 14 Stand, Gurugram',
            coordinates: { lat: 28.4720, lng: 77.0360 },
            rating: 4.9,
            isOnline: true,
            vehicle: 'Electric Cargo Loader (EV-04)',
            supportedMaterials: ['cardboard', 'paper', 'plastic', 'metal', 'glass', 'e_waste']
          },
          distanceKm: 0.6,
          estimatedArrivalMinutes: 8,
          matchScore: 98,
          reasons: ['0.6 km away in your locality', 'Rated 4.9★', 'Currently active & ready']
        },
        {
          collector: {
            id: 'col-2',
            name: 'Suresh Patel',
            role: 'collector',
            phone: '+91 98222 33445',
            address: 'Old Railway Road, Sector 12, Gurugram',
            coordinates: { lat: 28.4810, lng: 77.0420 },
            rating: 4.7,
            isOnline: true,
            vehicle: 'Pedal Cargo Rickshaw',
            supportedMaterials: ['cardboard', 'paper', 'plastic', 'metal']
          },
          distanceKm: 1.8,
          estimatedArrivalMinutes: 15,
          matchScore: 82,
          reasons: ['1.8 km away', 'Rated 4.7★']
        }
      ];
    }
  },
  getGroupedRoutes: async (): Promise<RouteGroup[]> => {
    try {
      const res = await fetch(`${API_BASE}/pickups/grouped`);
      return await handleResponse<RouteGroup[]>(res);
    } catch (e) {
      return [];
    }
  },
  createPickup: async (pickupData: Partial<PickupRequest>): Promise<{ data: PickupRequest; matchedCollector?: User }> => {
    const id = 'pk-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const now = new Date().toISOString();
    const ratePerKg = pickupData.ratePerKg || 14;
    const estWeight = Number(pickupData.estimatedWeight) || 10;
    
    const newPickup: PickupRequest = {
      id,
      customerId: pickupData.customerId || 'user-cust-1',
      customerName: pickupData.customerName || 'Aarav Sharma',
      customerPhone: pickupData.customerPhone || '+91 98765 43210',
      collectorId: pickupData.collectorId || 'col-1',
      collectorName: pickupData.collectorName || 'Ramesh Kumar',
      collectorPhone: pickupData.collectorPhone || '+91 98111 22334',
      materialCategory: pickupData.materialCategory || 'cardboard',
      estimatedWeight: estWeight,
      ratePerKg,
      totalValue: Math.round(estWeight * ratePerKg),
      location: pickupData.location || { address: 'Flat 402, Green Meadows Apt, Sector 14, Gurugram', lat: 28.4682, lng: 77.0321 },
      preferredTime: pickupData.preferredTime || 'Today, 3:00 PM - 5:00 PM',
      notes: pickupData.notes,
      status: 'requested',
      statusTimeline: [{ status: 'requested', timestamp: now, note: 'Pickup requested' }],
      createdAt: now,
      updatedAt: now
    };

    // Save locally immediately so it never vanishes
    const local = getLocal<PickupRequest[]>('kc_pickups', []);
    local.unshift(newPickup);
    setLocal('kc_pickups', local);

    try {
      const res = await fetch(`${API_BASE}/pickups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pickupData)
      });
      const json = await res.json();
      if (json.success && json.data) {
        // Sync server id if provided
        const idx = local.findIndex(p => p.id === newPickup.id);
        if (idx !== -1) local[idx] = json.data;
        setLocal('kc_pickups', local);
        return { data: json.data, matchedCollector: json.matchedCollector };
      }
    } catch (e) {
      console.warn('Network pickup post fallback to local:', e);
    }
    return { data: newPickup };
  },
  updatePickupStatus: async (id: string, status: PickupStatus, collectorId?: string, note?: string): Promise<PickupRequest> => {
    const local = getLocal<PickupRequest[]>('kc_pickups', []);
    const idx = local.findIndex(p => p.id === id);
    const now = new Date().toISOString();
    let updated: PickupRequest | undefined;

    if (idx !== -1) {
      local[idx].status = status;
      local[idx].statusTimeline.push({ status, timestamp: now, note: note || ('Status changed to ' + status) });
      local[idx].updatedAt = now;
      if (collectorId && !local[idx].collectorId) {
        local[idx].collectorId = collectorId;
        local[idx].collectorName = 'Ramesh Kumar';
        local[idx].collectorPhone = '+91 98111 22334';
      }
      updated = local[idx];
      setLocal('kc_pickups', local);
    }

    try {
      const res = await fetch(`${API_BASE}/pickups/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, collectorId, note })
      });
      const resData = await handleResponse<PickupRequest>(res);
      return resData;
    } catch (e) {
      return updated || ({} as PickupRequest);
    }
  },
  weighAndCompletePickup: async (
    id: string, 
    actualWeight: number, 
    paymentMethod: string,
    meta?: { materialCategory?: MaterialCategory; customerName?: string; ratePerKg?: number }
  ): Promise<{ pickup: PickupRequest; receipt: DigitalReceipt; updatedRecyclerStock: RecyclerStock }> => {
    const now = new Date().toISOString();
    const localPickups = getLocal<PickupRequest[]>('kc_pickups', []);
    let pickup = localPickups.find(p => p.id === id);

    const category = meta?.materialCategory || pickup?.materialCategory || 'cardboard';
    const customerName = meta?.customerName || pickup?.customerName || 'Aarav Sharma';
    const ratePerKg = meta?.ratePerKg || pickup?.ratePerKg || 14;
    const netPayout = Math.round(actualWeight * ratePerKg * 100) / 100;
    const receiptNumber = 'KC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const receipt: DigitalReceipt = {
      id: 'rcpt-' + Date.now(),
      receiptNumber,
      pickupId: id,
      customerId: pickup?.customerId || 'user-cust-1',
      customerName,
      collectorId: pickup?.collectorId || 'col-1',
      collectorName: pickup?.collectorName || 'Ramesh Kumar',
      materialCategory: category,
      materialName: category.toUpperCase(),
      actualWeight,
      ratePerKg,
      totalPayout: netPayout,
      paymentMethod: paymentMethod as any,
      timestamp: now,
      environmentalImpact: {
        co2SavedKg: Math.round(actualWeight * 2.1 * 10) / 10,
        landfillDivertedKg: actualWeight,
        treesSavedFraction: (category === 'paper' || category === 'cardboard') ? Math.round(actualWeight * 0.017 * 100) / 100 : 0.05,
        waterSavedLiters: Math.round(actualWeight * 22)
      }
    };

    // Save receipt locally
    const localReceipts = getLocal<DigitalReceipt[]>('kc_receipts', []);
    localReceipts.unshift(receipt);
    setLocal('kc_receipts', localReceipts);

    // Update pickup locally
    if (pickup) {
      pickup.status = 'completed';
      pickup.actualWeight = actualWeight;
      pickup.totalValue = netPayout;
      pickup.receiptId = receipt.id;
      pickup.statusTimeline.push({ status: 'completed', timestamp: now, note: 'Weighed ' + actualWeight + ' kg. Paid ₹' + netPayout });
      setLocal('kc_pickups', localPickups);
    }

    // Update recycler stock locally
    const localStock = getLocal<RecyclerStock[]>('kc_stock', [
      { category: 'cardboard', name: 'Cardboard & Cartons', currentStockKg: 340, totalCollectedKg: 1250, lastUpdated: now, unitRate: 14, estimatedValue: 4760 },
      { category: 'paper', name: 'Newspaper & Office Paper', currentStockKg: 210, totalCollectedKg: 890, lastUpdated: now, unitRate: 12, estimatedValue: 2520 },
      { category: 'plastic', name: 'Rigid & Soft Plastics', currentStockKg: 185, totalCollectedKg: 640, lastUpdated: now, unitRate: 18, estimatedValue: 3330 },
      { category: 'metal', name: 'Scrap Metals', currentStockKg: 95, totalCollectedKg: 420, lastUpdated: now, unitRate: 32, estimatedValue: 3040 },
      { category: 'glass', name: 'Glass Bottles & Jars', currentStockKg: 140, totalCollectedKg: 510, lastUpdated: now, unitRate: 4, estimatedValue: 560 },
      { category: 'e_waste', name: 'Electronic Waste', currentStockKg: 62, totalCollectedKg: 195, lastUpdated: now, unitRate: 45, estimatedValue: 2790 }
    ]);
    const stockItem = localStock.find(s => s.category === category);
    if (stockItem) {
      stockItem.currentStockKg = Math.round((stockItem.currentStockKg + actualWeight) * 10) / 10;
      stockItem.totalCollectedKg = Math.round((stockItem.totalCollectedKg + actualWeight) * 10) / 10;
      stockItem.lastUpdated = now;
      stockItem.estimatedValue = Math.round(stockItem.currentStockKg * stockItem.unitRate);
      setLocal('kc_stock', localStock);
    }

    // Attempt server sync
    try {
      const res = await fetch(`${API_BASE}/pickups/${id}/weigh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actualWeight, paymentMethod, materialCategory: category, customerName })
      });
      const serverData = await handleResponse<{ pickup: PickupRequest; receipt: DigitalReceipt; updatedRecyclerStock: RecyclerStock }>(res);
      return serverData;
    } catch (e) {
      console.warn('Network weigh post fallback to local:', e);
    }

    return {
      pickup: pickup || ({} as PickupRequest),
      receipt,
      updatedRecyclerStock: stockItem || ({} as RecyclerStock)
    };
  },

  // Receipts
  getReceipts: async (customerId?: string): Promise<DigitalReceipt[]> => {
    const local = getLocal<DigitalReceipt[]>('kc_receipts', []);
    try {
      const query = customerId ? `?customerId=${customerId}` : '';
      const res = await fetch(`${API_BASE}/receipts${query}`);
      const serverReceipts = await handleResponse<DigitalReceipt[]>(res);
      const map = new Map<string, DigitalReceipt>();
      serverReceipts.forEach(r => map.set(r.id, r));
      local.forEach(r => map.set(r.id, r));
      const merged = Array.from(map.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLocal('kc_receipts', merged);
      return merged;
    } catch (e) {
      return local;
    }
  },
  getReceipt: async (id: string): Promise<DigitalReceipt> => {
    const local = getLocal<DigitalReceipt[]>('kc_receipts', []);
    const found = local.find(r => r.id === id || r.receiptNumber === id);
    if (found) return found;
    const res = await fetch(`${API_BASE}/receipts/${id}`);
    return handleResponse<DigitalReceipt>(res);
  },

  // Recycler Inventory
  getRecyclerStock: async (): Promise<RecyclerStock[]> => {
    const local = getLocal<RecyclerStock[]>('kc_stock', []);
    try {
      const res = await fetch(`${API_BASE}/inventory`);
      const serverStock = await handleResponse<RecyclerStock[]>(res);
      if (local.length > 0) {
        // preserve verified additions
        serverStock.forEach(s => {
          const l = local.find(item => item.category === s.category);
          if (l && l.currentStockKg > s.currentStockKg) {
            s.currentStockKg = l.currentStockKg;
            s.totalCollectedKg = l.totalCollectedKg;
            s.estimatedValue = l.estimatedValue;
          }
        });
      }
      setLocal('kc_stock', serverStock);
      return serverStock;
    } catch (e) {
      return local;
    }
  },
  dispatchStock: async (category: MaterialCategory, weightKg: number, destinationFactory: string): Promise<RecyclerStock> => {
    const local = getLocal<RecyclerStock[]>('kc_stock', []);
    const item = local.find(s => s.category === category);
    if (item) {
      item.currentStockKg = Math.max(0, Math.round((item.currentStockKg - weightKg) * 10) / 10);
      item.estimatedValue = Math.round(item.currentStockKg * item.unitRate);
      setLocal('kc_stock', local);
    }
    try {
      const res = await fetch(`${API_BASE}/inventory/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, weightKg, destinationFactory })
      });
      return await handleResponse<RecyclerStock>(res);
    } catch (e) {
      return item || ({} as RecyclerStock);
    }
  },

  // Users & Analytics
  getUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      return await handleResponse<User[]>(res);
    } catch (e) {
      return [];
    }
  },
  getCollectors: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${API_BASE}/users/collectors`);
      return await handleResponse<User[]>(res);
    } catch (e) {
      return [];
    }
  },
  toggleCollectorOnline: async (id: string, isOnline: boolean): Promise<User> => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}/online`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOnline })
      });
      return await handleResponse<User>(res);
    } catch (e) {
      return {} as User;
    }
  },
  getAnalytics: async (): Promise<PlatformAnalytics> => {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      return await handleResponse<PlatformAnalytics>(res);
    } catch (e) {
      return {
        totalWasteCollectedKg: 3950,
        totalPayoutsINR: 48800,
        totalPickupsCompleted: 145,
        activeHouseholds: 328,
        activeCollectors: 3,
        materialBreakdown: { cardboard: 1260, paper: 890, plastic: 640, metal: 420, glass: 510, e_waste: 195 },
        co2SavedTotalKg: 8490,
        treesSavedTotal: 36
      };
    }
  },
  resetDemo: async (): Promise<void> => {
    try {
      localStorage.removeItem('kc_pickups');
      localStorage.removeItem('kc_receipts');
      localStorage.removeItem('kc_stock');
      localStorage.removeItem('kc_rates');
      await fetch(`${API_BASE}/analytics/reset`, { method: 'POST' });
    } catch (e) {
      // ignore
    }
  }
};
