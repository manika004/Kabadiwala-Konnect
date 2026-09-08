import fs from 'fs';
import path from 'path';
import { 
  RateItem, 
  User, 
  PickupRequest, 
  DigitalReceipt, 
  RecyclerStock, 
  PlatformAnalytics, 
  MaterialCategory 
} from './types';

const DB_FILE = process.env.VERCEL 
  ? path.join('/tmp', 'db.json') 
  : path.join(__dirname, 'data', 'db.json');

interface DatabaseSchema {
  rates: RateItem[];
  users: User[];
  pickups: PickupRequest[];
  receipts: DigitalReceipt[];
  recyclerStock: RecyclerStock[];
}

const DEFAULT_RATES: RateItem[] = [
  {
    category: 'cardboard',
    name: 'Cardboard & Cartons (Gatta)',
    ratePerKg: 14,
    unit: 'kg',
    description: 'Corrugated cardboard boxes, delivery cartons, craft paper boards.',
    ecoBenefit: 'Saves 17 trees and 4,000 kWh of energy per ton.',
    co2FactorKg: 1.8
  },
  {
    category: 'paper',
    name: 'Newspaper & Office Paper (Raddi)',
    ratePerKg: 12,
    unit: 'kg',
    description: 'Daily newspapers, magazines, notebook paper, white office paper.',
    ecoBenefit: 'Reduces water usage by 60% compared to virgin paper manufacturing.',
    co2FactorKg: 1.5
  },
  {
    category: 'plastic',
    name: 'Rigid & Soft Plastics (PET/HDPE)',
    ratePerKg: 18,
    unit: 'kg',
    description: 'Beverage bottles (PET), milk pouches, shampoo bottles, hard plastic buckets.',
    ecoBenefit: 'Prevents plastic pollution in oceans and saves 5.7 m3 of landfill space per ton.',
    co2FactorKg: 2.2
  },
  {
    category: 'metal',
    name: 'Scrap Metals (Iron, Aluminum, Brass)',
    ratePerKg: 32,
    unit: 'kg',
    description: 'Beverage cans, iron rods, tin containers, copper wires, brass utensils.',
    ecoBenefit: 'Recycling aluminum saves 95% of energy required to mine virgin bauxite.',
    co2FactorKg: 4.5
  },
  {
    category: 'glass',
    name: 'Glass Bottles & Jars',
    ratePerKg: 4,
    unit: 'kg',
    description: 'Beer bottles, sauce jars, clean broken glass container cullet.',
    ecoBenefit: '100% recyclable indefinitely without degradation in quality.',
    co2FactorKg: 0.8
  },
  {
    category: 'e_waste',
    name: 'Electronic Waste (E-Kachra)',
    ratePerKg: 45,
    unit: 'kg',
    description: 'Discarded mobile phones, chargers, circuit boards, small home appliances.',
    ecoBenefit: 'Recovers precious metals (gold, copper) and prevents toxic lead/cadmium leaching.',
    co2FactorKg: 6.0
  }
];

const DEFAULT_USERS: User[] = [
  {
    id: 'user-cust-1',
    name: 'Aarav Sharma',
    role: 'customer',
    phone: '+91 98765 43210',
    address: 'Flat 402, Green Meadows Apt, Sector 14, Gurugram',
    coordinates: { lat: 28.4682, lng: 77.0321 },
    rating: 4.9
  },
  {
    id: 'col-1',
    name: 'Ramesh Kumar',
    role: 'collector',
    phone: '+91 98111 22334',
    address: 'Sector 14 Market Stand, Gurugram',
    coordinates: { lat: 28.4720, lng: 77.0360 },
    rating: 4.9,
    isOnline: true,
    vehicle: 'Electric Cargo Loader (EV-Rickshaw)',
    supportedMaterials: ['cardboard', 'paper', 'plastic', 'metal', 'glass', 'e_waste']
  },
  {
    id: 'col-2',
    name: 'Suresh Patel',
    role: 'collector',
    phone: '+91 98222 33445',
    address: 'Old Railway Road, Sector 12, Gurugram',
    coordinates: { lat: 28.4810, lng: 77.0420 },
    rating: 4.7,
    isOnline: true,
    vehicle: 'Heavy Pedal Cargo Rickshaw',
    supportedMaterials: ['cardboard', 'paper', 'plastic', 'metal']
  },
  {
    id: 'col-3',
    name: 'Mohammad Imran',
    role: 'collector',
    phone: '+91 98333 44556',
    address: 'DLF Phase 2 Hub, Gurugram',
    coordinates: { lat: 28.4890, lng: 77.0850 },
    rating: 4.8,
    isOnline: false,
    vehicle: 'Tata Ace Mini Truck',
    supportedMaterials: ['cardboard', 'paper', 'plastic', 'metal', 'glass', 'e_waste']
  },
  {
    id: 'user-rec-1',
    name: 'EcoCycle Aggregators & Processing Hub',
    role: 'recycler',
    phone: '+91 98444 55667',
    address: 'Plot 88, Udyog Vihar Phase 1, Gurugram',
    coordinates: { lat: 28.4510, lng: 77.0210 },
    rating: 5.0
  },
  {
    id: 'user-admin-1',
    name: 'Central Operations Admin',
    role: 'admin',
    phone: '+91 99999 00000',
    address: 'Operations HQ, Gurugram',
    coordinates: { lat: 28.4600, lng: 77.0300 },
    rating: 5.0
  }
];

const DEFAULT_RECYCLER_STOCK: RecyclerStock[] = [
  {
    category: 'cardboard',
    name: 'Cardboard & Cartons',
    currentStockKg: 340,
    totalCollectedKg: 1250,
    lastUpdated: new Date().toISOString(),
    unitRate: 14,
    estimatedValue: 340 * 14
  },
  {
    category: 'paper',
    name: 'Newspaper & Office Paper',
    currentStockKg: 210,
    totalCollectedKg: 890,
    lastUpdated: new Date().toISOString(),
    unitRate: 12,
    estimatedValue: 210 * 12
  },
  {
    category: 'plastic',
    name: 'Rigid & Soft Plastics',
    currentStockKg: 185,
    totalCollectedKg: 640,
    lastUpdated: new Date().toISOString(),
    unitRate: 18,
    estimatedValue: 185 * 18
  },
  {
    category: 'metal',
    name: 'Scrap Metals',
    currentStockKg: 95,
    totalCollectedKg: 420,
    lastUpdated: new Date().toISOString(),
    unitRate: 32,
    estimatedValue: 95 * 32
  },
  {
    category: 'glass',
    name: 'Glass Bottles & Cullet',
    currentStockKg: 140,
    totalCollectedKg: 510,
    lastUpdated: new Date().toISOString(),
    unitRate: 4,
    estimatedValue: 140 * 4
  },
  {
    category: 'e_waste',
    name: 'Electronic Waste',
    currentStockKg: 62,
    totalCollectedKg: 195,
    lastUpdated: new Date().toISOString(),
    unitRate: 45,
    estimatedValue: 62 * 45
  }
];

const DEFAULT_RECEIPTS: DigitalReceipt[] = [
  {
    id: 'rcpt-seed-101',
    receiptNumber: 'KC-2026-0891',
    pickupId: 'pk-seed-101',
    customerId: 'user-cust-1',
    customerName: 'Aarav Sharma',
    collectorId: 'col-1',
    collectorName: 'Ramesh Kumar',
    materialCategory: 'paper',
    materialName: 'Newspaper & Office Paper (Raddi)',
    actualWeight: 15.0,
    ratePerKg: 12,
    totalPayout: 180,
    paymentMethod: 'Instant UPI',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    environmentalImpact: {
      co2SavedKg: 22.5,
      landfillDivertedKg: 15.0,
      treesSavedFraction: 0.25,
      waterSavedLiters: 390
    }
  }
];

const DEFAULT_PICKUPS: PickupRequest[] = [
  {
    id: 'pk-seed-101',
    customerId: 'user-cust-1',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98765 43210',
    collectorId: 'col-1',
    collectorName: 'Ramesh Kumar',
    collectorPhone: '+91 98111 22334',
    materialCategory: 'paper',
    estimatedWeight: 14.0,
    actualWeight: 15.0,
    ratePerKg: 12,
    totalValue: 180,
    location: {
      address: 'Flat 402, Green Meadows Apt, Sector 14, Gurugram',
      lat: 28.4682,
      lng: 77.0321
    },
    preferredTime: '10:00 AM - 12:00 PM',
    notes: 'Old stacks of newspapers and magazines',
    status: 'completed',
    statusTimeline: [
      { status: 'requested', timestamp: new Date(Date.now() - 86400000 * 2 - 3600000).toISOString() },
      { status: 'accepted', timestamp: new Date(Date.now() - 86400000 * 2 - 3000000).toISOString() },
      { status: 'on_the_way', timestamp: new Date(Date.now() - 86400000 * 2 - 2000000).toISOString() },
      { status: 'collected', timestamp: new Date(Date.now() - 86400000 * 2 - 1000000).toISOString() },
      { status: 'completed', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() }
    ],
    receiptId: 'rcpt-seed-101',
    createdAt: new Date(Date.now() - 86400000 * 2 - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading db file, falling back to defaults:', e);
    }
    
    const initial: DatabaseSchema = {
      rates: DEFAULT_RATES,
      users: DEFAULT_USERS,
      pickups: DEFAULT_PICKUPS,
      receipts: DEFAULT_RECEIPTS,
      recyclerStock: DEFAULT_RECYCLER_STOCK
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(dataToSave?: DatabaseSchema): void {
    try {
      const data = dataToSave || this.data;
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving db file:', e);
    }
  }

  getRates(): RateItem[] {
    return this.data.rates;
  }

  getRateByCategory(category: MaterialCategory): RateItem | undefined {
    return this.data.rates.find(r => r.category === category);
  }

  updateRate(category: MaterialCategory, newRate: number): RateItem | null {
    const item = this.data.rates.find(r => r.category === category);
    if (!item) return null;
    item.ratePerKg = newRate;
    
    const stock = this.data.recyclerStock.find(s => s.category === category);
    if (stock) {
      stock.unitRate = newRate;
      stock.estimatedValue = Math.round(stock.currentStockKg * newRate);
      stock.lastUpdated = new Date().toISOString();
    }
    
    this.saveData();
    return item;
  }

  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getCollectors(): User[] {
    return this.data.users.filter(u => u.role === 'collector');
  }

  updateUserStatus(id: string, isOnline: boolean): User | null {
    const user = this.data.users.find(u => u.id === id);
    if (!user) return null;
    user.isOnline = isOnline;
    this.saveData();
    return user;
  }

  getPickups(): PickupRequest[] {
    return this.data.pickups;
  }

  getPickupById(id: string): PickupRequest | undefined {
    return this.data.pickups.find(p => p.id === id);
  }

  createPickup(pickup: PickupRequest): PickupRequest {
    this.data.pickups.unshift(pickup);
    this.saveData();
    return pickup;
  }

  updatePickup(id: string, updates: Partial<PickupRequest>): PickupRequest | null {
    const idx = this.data.pickups.findIndex(p => p.id === id);
    if (idx === -1) return null;
    
    this.data.pickups[idx] = {
      ...this.data.pickups[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.pickups[idx];
  }

  getReceipts(): DigitalReceipt[] {
    return this.data.receipts;
  }

  getReceiptById(id: string): DigitalReceipt | undefined {
    return this.data.receipts.find(r => r.id === id || r.receiptNumber === id);
  }

  createReceipt(receipt: DigitalReceipt): DigitalReceipt {
    this.data.receipts.unshift(receipt);
    this.saveData();
    return receipt;
  }

  getRecyclerStock(): RecyclerStock[] {
    return this.data.recyclerStock;
  }

  addStockFromCompletedPickup(category: MaterialCategory, weightKg: number): RecyclerStock | null {
    const stock = this.data.recyclerStock.find(s => s.category === category);
    if (!stock) return null;
    stock.currentStockKg = Math.round((stock.currentStockKg + weightKg) * 10) / 10;
    stock.totalCollectedKg = Math.round((stock.totalCollectedKg + weightKg) * 10) / 10;
    stock.lastUpdated = new Date().toISOString();
    stock.estimatedValue = Math.round(stock.currentStockKg * stock.unitRate);
    this.saveData();
    return stock;
  }

  dispatchStock(category: MaterialCategory, weightKg: number): RecyclerStock | null {
    const stock = this.data.recyclerStock.find(s => s.category === category);
    if (!stock) return null;
    stock.currentStockKg = Math.max(0, Math.round((stock.currentStockKg - weightKg) * 10) / 10);
    stock.lastUpdated = new Date().toISOString();
    stock.estimatedValue = Math.round(stock.currentStockKg * stock.unitRate);
    this.saveData();
    return stock;
  }

  getAnalytics(): PlatformAnalytics {
    const completed = this.data.pickups.filter(p => p.status === 'completed');
    const totalWeight = completed.reduce((sum, p) => sum + (p.actualWeight || p.estimatedWeight || 0), 0) + 3905;
    const totalPayouts = this.data.receipts.reduce((sum, r) => sum + r.totalPayout, 0) + 48200;
    
    const materialBreakdown: { [key in MaterialCategory]?: number } = {};
    for (const item of this.data.recyclerStock) {
      materialBreakdown[item.category] = item.totalCollectedKg;
    }

    const co2SavedTotalKg = Math.round(totalWeight * 2.15);
    const treesSavedTotal = Math.round(((materialBreakdown.paper || 0) + (materialBreakdown.cardboard || 0)) * 0.017);

    return {
      totalWasteCollectedKg: Math.round(totalWeight * 10) / 10,
      totalPayoutsINR: Math.round(totalPayouts),
      totalPickupsCompleted: completed.length + 142,
      activeHouseholds: 328,
      activeCollectors: this.data.users.filter(u => u.role === 'collector').length,
      materialBreakdown,
      co2SavedTotalKg,
      treesSavedTotal: Math.max(1, treesSavedTotal)
    };
  }

  resetDemo(): void {
    this.data = {
      rates: DEFAULT_RATES,
      users: DEFAULT_USERS,
      pickups: DEFAULT_PICKUPS,
      receipts: DEFAULT_RECEIPTS,
      recyclerStock: DEFAULT_RECYCLER_STOCK
    };
    this.saveData();
  }
}

export const db = new Database();