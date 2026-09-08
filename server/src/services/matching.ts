import { User, MaterialCategory, PickupRequest } from '../types';
import { db } from '../db';

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface MatchedCollector {
  collector: User;
  distanceKm: number;
  estimatedArrivalMinutes: number;
  matchScore: number;
  reasons: string[];
}

export function matchCollector(
  customerLat: number, 
  customerLng: number, 
  material: MaterialCategory
): MatchedCollector[] {
  const collectors = db.getCollectors();
  const matches: MatchedCollector[] = [];

  for (const col of collectors) {
    const isOnline = col.isOnline ?? false;
    const supportsMaterial = !col.supportedMaterials || col.supportedMaterials.includes(material);
    
    if (!supportsMaterial) {
      continue;
    }

    const dist = calculateDistanceKm(customerLat, customerLng, col.coordinates.lat, col.coordinates.lng);
    const etaMins = Math.max(5, Math.round(dist * 6) + 5);
    
    let score = 100 - (dist * 10) + (col.rating * 10);
    if (!isOnline) score -= 30;

    const reasons: string[] = [
      dist + ' km away in your locality',
      'Rated ' + col.rating + '★',
      supportsMaterial ? 'Collects ' + material.replace('_', ' ') : ''
    ].filter(Boolean);

    if (isOnline) {
      reasons.push('Currently active & ready');
    }

    matches.push({
      collector: col,
      distanceKm: dist,
      estimatedArrivalMinutes: etaMins,
      matchScore: Math.round(score),
      reasons
    });
  }

  matches.sort((a, b) => b.matchScore - a.matchScore);
  return matches;
}

export interface RouteGroup {
  clusterId: string;
  clusterName: string;
  centerLat: number;
  centerLng: number;
  pickups: PickupRequest[];
  totalEstWeight: number;
  estimatedEarnings: number;
}

export function groupNearbyPickups(pickups: PickupRequest[], maxDistanceKm = 2.5): RouteGroup[] {
  const pending = pickups.filter(p => p.status === 'requested' || p.status === 'accepted');
  const groups: RouteGroup[] = [];

  for (const pickup of pending) {
    let placed = false;
    for (const grp of groups) {
      const dist = calculateDistanceKm(grp.centerLat, grp.centerLng, pickup.location.lat, pickup.location.lng);
      if (dist <= maxDistanceKm) {
        grp.pickups.push(pickup);
        grp.totalEstWeight += pickup.estimatedWeight;
        const rate = db.getRateByCategory(pickup.materialCategory)?.ratePerKg || 15;
        grp.estimatedEarnings += pickup.estimatedWeight * rate;
        placed = true;
        break;
      }
    }

    if (!placed) {
      const rate = db.getRateByCategory(pickup.materialCategory)?.ratePerKg || 15;
      const addrFirst = pickup.location.address.split(',')[0];
      groups.push({
        clusterId: 'cluster-' + (groups.length + 1),
        clusterName: addrFirst + ' Cluster',
        centerLat: pickup.location.lat,
        centerLng: pickup.location.lng,
        pickups: [pickup],
        totalEstWeight: pickup.estimatedWeight,
        estimatedEarnings: pickup.estimatedWeight * rate
      });
    }
  }

  return groups;
}