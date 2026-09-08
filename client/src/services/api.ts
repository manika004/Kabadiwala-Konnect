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
    const res = await fetch(`${API_BASE}/rates`);
    return handleResponse<RateItem[]>(res);
  },
  updateRate: async (category: MaterialCategory, ratePerKg: number): Promise<RateItem> => {
    const res = await fetch(`${API_BASE}/rates/${category}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ratePerKg })
    });
    return handleResponse<RateItem>(res);
  },

  // AI Classification
  getAISamples: async (): Promise<DemoSample[]> => {
    const res = await fetch(`${API_BASE}/ai/samples`);
    const data = await res.json();
    return data.samples;
  },
  classifyWaste: async (params: { sampleId?: string; image?: string }): Promise<AIClassificationResult> => {
    const res = await fetch(`${API_BASE}/ai/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return handleResponse<AIClassificationResult>(res);
  },

  // Pickups
  getPickups: async (params?: { customerId?: string; collectorId?: string; status?: PickupStatus }): Promise<PickupRequest[]> => {
    const query = new URLSearchParams();
    if (params?.customerId) query.append('customerId', params.customerId);
    if (params?.collectorId) query.append('collectorId', params.collectorId);
    if (params?.status) query.append('status', params.status);
    const res = await fetch(`${API_BASE}/pickups?${query.toString()}`);
    return handleResponse<PickupRequest[]>(res);
  },
  getPickup: async (id: string): Promise<PickupRequest> => {
    const res = await fetch(`${API_BASE}/pickups/${id}`);
    return handleResponse<PickupRequest>(res);
  },
  matchCollectors: async (lat: number, lng: number, material: MaterialCategory): Promise<MatchedCollector[]> => {
    const res = await fetch(`${API_BASE}/pickups/match?lat=${lat}&lng=${lng}&material=${material}`);
    return handleResponse<MatchedCollector[]>(res);
  },
  getGroupedRoutes: async (): Promise<RouteGroup[]> => {
    const res = await fetch(`${API_BASE}/pickups/grouped`);
    return handleResponse<RouteGroup[]>(res);
  },
  createPickup: async (pickupData: Partial<PickupRequest>): Promise<{ data: PickupRequest; matchedCollector?: User }> => {
    const res = await fetch(`${API_BASE}/pickups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pickupData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to create pickup');
    return { data: json.data, matchedCollector: json.matchedCollector };
  },
  updatePickupStatus: async (id: string, status: PickupStatus, collectorId?: string, note?: string): Promise<PickupRequest> => {
    const res = await fetch(`${API_BASE}/pickups/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, collectorId, note })
    });
    return handleResponse<PickupRequest>(res);
  },
  weighAndCompletePickup: async (id: string, actualWeight: number, paymentMethod: string): Promise<{ pickup: PickupRequest; receipt: DigitalReceipt; updatedRecyclerStock: RecyclerStock }> => {
    const res = await fetch(`${API_BASE}/pickups/${id}/weigh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actualWeight, paymentMethod })
    });
    return handleResponse<{ pickup: PickupRequest; receipt: DigitalReceipt; updatedRecyclerStock: RecyclerStock }>(res);
  },

  // Receipts
  getReceipts: async (customerId?: string): Promise<DigitalReceipt[]> => {
    const query = customerId ? `?customerId=${customerId}` : '';
    const res = await fetch(`${API_BASE}/receipts${query}`);
    return handleResponse<DigitalReceipt[]>(res);
  },
  getReceipt: async (id: string): Promise<DigitalReceipt> => {
    const res = await fetch(`${API_BASE}/receipts/${id}`);
    return handleResponse<DigitalReceipt>(res);
  },

  // Recycler Inventory
  getRecyclerStock: async (): Promise<RecyclerStock[]> => {
    const res = await fetch(`${API_BASE}/inventory`);
    return handleResponse<RecyclerStock[]>(res);
  },
  dispatchStock: async (category: MaterialCategory, weightKg: number, destinationFactory: string): Promise<RecyclerStock> => {
    const res = await fetch(`${API_BASE}/inventory/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, weightKg, destinationFactory })
    });
    return handleResponse<RecyclerStock>(res);
  },

  // Users & Analytics
  getUsers: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/users`);
    return handleResponse<User[]>(res);
  },
  getCollectors: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE}/users/collectors`);
    return handleResponse<User[]>(res);
  },
  toggleCollectorOnline: async (id: string, isOnline: boolean): Promise<User> => {
    const res = await fetch(`${API_BASE}/users/${id}/online`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOnline })
    });
    return handleResponse<User>(res);
  },
  getAnalytics: async (): Promise<PlatformAnalytics> => {
    const res = await fetch(`${API_BASE}/analytics`);
    return handleResponse<PlatformAnalytics>(res);
  },
  resetDemo: async (): Promise<void> => {
    await fetch(`${API_BASE}/analytics/reset`, { method: 'POST' });
  }
};