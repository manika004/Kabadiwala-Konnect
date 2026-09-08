import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { PickupRequest, PickupStatus, DigitalReceipt, MaterialCategory } from '../types';
import { matchCollector, groupNearbyPickups } from '../services/matching';
import { calculateIndicativePrice } from '../services/pricing';

const router = Router();

router.get('/match', (req, res) => {
  const lat = parseFloat(req.query.lat as string) || 28.4682;
  const lng = parseFloat(req.query.lng as string) || 77.0321;
  const material = (req.query.material as MaterialCategory) || 'cardboard';

  const matches = matchCollector(lat, lng, material);
  res.json({
    success: true,
    data: matches
  });
});

router.get('/grouped', (_req, res) => {
  const allPickups = db.getPickups();
  const groups = groupNearbyPickups(allPickups);
  res.json({
    success: true,
    data: groups
  });
});

router.get('/', (req, res) => {
  let pickups = db.getPickups();
  const { status, customerId, collectorId } = req.query;

  if (status) {
    pickups = pickups.filter(p => p.status === status);
  }
  if (customerId) {
    pickups = pickups.filter(p => p.customerId === customerId);
  }
  if (collectorId) {
    pickups = pickups.filter(p => p.collectorId === collectorId || !p.collectorId);
  }

  res.json({
    success: true,
    data: pickups
  });
});

router.get('/:id', (req, res) => {
  const pickup = db.getPickupById(req.params.id);
  if (!pickup) {
    return res.status(404).json({ success: false, message: 'Pickup not found' });
  }
  return res.json({ success: true, data: pickup });
});

router.post('/', (req, res) => {
  const {
    customerId = 'user-cust-1',
    customerName = 'Aarav Sharma',
    customerPhone = '+91 98765 43210',
    materialCategory,
    estimatedWeight,
    location,
    preferredTime = 'Today, 2:00 PM - 4:00 PM',
    notes,
    aiClassification,
    collectorId,
    isBulkOrder,
    organizationName,
    institutionType,
    vehicleRequired,
    esgCertificateRequested,
    billingGst
  } = req.body;

  if (!materialCategory || !estimatedWeight || !location?.address) {
    return res.status(400).json({
      success: false,
      message: 'materialCategory, estimatedWeight, and location are required'
    });
  }

  const pickupLat = location.lat || 28.4682;
  const pickupLng = location.lng || 77.0321;

  let assignedCollector = collectorId ? db.getUserById(collectorId) : undefined;
  if (!assignedCollector) {
    const matches = matchCollector(pickupLat, pickupLng, materialCategory);
    if (matches.length > 0) {
      assignedCollector = matches[0].collector;
    }
  }

  const rateItem = db.getRateByCategory(materialCategory);
  const ratePerKg = rateItem?.ratePerKg || 14;

  const now = new Date().toISOString();
  const newPickup: PickupRequest = {
    id: 'pk-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    customerId,
    customerName,
    customerPhone,
    collectorId: assignedCollector?.id,
    collectorName: assignedCollector?.name,
    collectorPhone: assignedCollector?.phone,
    materialCategory,
    estimatedWeight: Number(estimatedWeight),
    ratePerKg,
    totalValue: Math.round(Number(estimatedWeight) * ratePerKg),
    location: {
      address: location.address,
      lat: pickupLat,
      lng: pickupLng
    },
    preferredTime,
    notes,
    aiClassification,
    isBulkOrder: Boolean(isBulkOrder),
    organizationName,
    institutionType,
    vehicleRequired,
    esgCertificateRequested: Boolean(esgCertificateRequested),
    billingGst,
    status: 'requested',
    statusTimeline: [
      {
        status: 'requested',
        timestamp: now,
        note: 'Pickup requested for ' + estimatedWeight + ' kg of ' + materialCategory
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  db.createPickup(newPickup);

  return res.status(201).json({
    success: true,
    data: newPickup,
    matchedCollector: assignedCollector
  });
});

router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, collectorId, note } = req.body as {
    status: PickupStatus;
    collectorId?: string;
    note?: string;
  };

  const pickup = db.getPickupById(id);
  if (!pickup) {
    return res.status(404).json({ success: false, message: 'Pickup not found' });
  }

  const now = new Date().toISOString();
  const updates: Partial<PickupRequest> = {
    status,
    statusTimeline: [
      ...pickup.statusTimeline,
      {
        status,
        timestamp: now,
        note: note || ('Status changed to ' + status)
      }
    ]
  };

  if (collectorId && !pickup.collectorId) {
    const col = db.getUserById(collectorId);
    if (col) {
      updates.collectorId = col.id;
      updates.collectorName = col.name;
      updates.collectorPhone = col.phone;
    }
  }

  const updated = db.updatePickup(id, updates);
  return res.json({
    success: true,
    data: updated
  });
});

router.post('/:id/weigh', (req, res) => {
  const { id } = req.params;
  const { 
    actualWeight, 
    paymentMethod = 'Instant UPI',
    materialCategory = 'cardboard',
    customerName = 'Aarav Sharma'
  } = req.body;

  let pickup = db.getPickupById(id);
  if (!pickup) {
    pickup = {
      id,
      customerId: 'user-cust-1',
      customerName,
      customerPhone: '+91 98765 43210',
      collectorId: 'col-1',
      collectorName: 'Ramesh Kumar',
      collectorPhone: '+91 98111 22334',
      materialCategory: materialCategory as MaterialCategory,
      estimatedWeight: Number(actualWeight) || 10,
      location: {
        address: 'Flat 402, Green Meadows Apt, Sector 14, Gurugram',
        lat: 28.4682,
        lng: 77.0321
      },
      preferredTime: 'Today',
      status: 'accepted',
      statusTimeline: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.createPickup(pickup);
  }

  const weight = parseFloat(actualWeight);
  if (isNaN(weight) || weight <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid actual weight' });
  }

  const calculation = calculateIndicativePrice(pickup.materialCategory, weight);
  const receiptNumber = 'KC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date().toISOString();

  const receipt: DigitalReceipt = {
    id: 'rcpt-' + uuidv4(),
    receiptNumber,
    pickupId: pickup.id,
    customerId: pickup.customerId,
    customerName: pickup.customerName,
    collectorId: pickup.collectorId || 'col-1',
    collectorName: pickup.collectorName || 'Ramesh Kumar',
    materialCategory: pickup.materialCategory,
    materialName: calculation.categoryName,
    actualWeight: weight,
    ratePerKg: calculation.ratePerKg,
    totalPayout: calculation.totalPayoutINR,
    paymentMethod,
    timestamp: now,
    environmentalImpact: calculation.environmentalImpact
  };

  db.createReceipt(receipt);

  const updatedPickup = db.updatePickup(id, {
    actualWeight: weight,
    ratePerKg: calculation.ratePerKg,
    totalValue: calculation.totalPayoutINR,
    receiptId: receipt.id,
    status: 'completed',
    statusTimeline: [
      ...pickup.statusTimeline,
      {
        status: 'collected',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        note: 'Weighed on digital scale: ' + weight + ' kg'
      },
      {
        status: 'completed',
        timestamp: now,
        note: 'Transaction completed. Payout ₹' + calculation.totalPayoutINR + ' via ' + paymentMethod
      }
    ]
  });

  const updatedStock = db.addStockFromCompletedPickup(pickup.materialCategory, weight);

  return res.json({
    success: true,
    data: {
      pickup: updatedPickup,
      receipt,
      updatedRecyclerStock: updatedStock
    },
    message: 'Pickup completed! ₹' + calculation.totalPayoutINR + ' calculated and Recycler stock updated.'
  });
});

export default router;