import { MaterialCategory, EnvironmentalImpact } from '../types';
import { db } from '../db';

export interface PriceCalculationResult {
  category: MaterialCategory;
  categoryName: string;
  actualWeightKg: number;
  ratePerKg: number;
  totalPayoutINR: number;
  environmentalImpact: EnvironmentalImpact;
}

export function calculateIndicativePrice(category: MaterialCategory, weightKg: number): PriceCalculationResult {
  const rateItem = db.getRateByCategory(category);
  const ratePerKg = rateItem ? rateItem.ratePerKg : 15;
  const categoryName = rateItem ? rateItem.name : category;
  
  const totalPayoutINR = Math.round(weightKg * ratePerKg * 100) / 100;
  
  const co2Factor = rateItem?.co2FactorKg || 2.0;
  const co2SavedKg = Math.round(weightKg * co2Factor * 10) / 10;
  const landfillDivertedKg = Math.round(weightKg * 10) / 10;
  
  let treesSavedFraction = 0;
  if (category === 'paper' || category === 'cardboard') {
    treesSavedFraction = Math.round((weightKg / 1000 * 17) * 100) / 100;
  }
  
  let waterSavedLiters = 0;
  if (category === 'paper') waterSavedLiters = Math.round(weightKg * 26);
  else if (category === 'plastic') waterSavedLiters = Math.round(weightKg * 16);
  else if (category === 'metal') waterSavedLiters = Math.round(weightKg * 35);
  else waterSavedLiters = Math.round(weightKg * 10);

  return {
    category,
    categoryName,
    actualWeightKg: weightKg,
    ratePerKg,
    totalPayoutINR,
    environmentalImpact: {
      co2SavedKg,
      landfillDivertedKg,
      treesSavedFraction,
      waterSavedLiters
    }
  };
}