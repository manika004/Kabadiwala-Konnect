import { Router } from 'express';
import { db } from '../db';
import { MaterialCategory } from '../types';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: db.getRecyclerStock()
  });
});

router.post('/dispatch', (req, res) => {
  const { category, weightKg, destinationFactory } = req.body;

  if (!category || !weightKg || weightKg <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid category or weight' });
  }

  const updated = db.dispatchStock(category as MaterialCategory, Number(weightKg));
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Stock category not found' });
  }

  return res.json({
    success: true,
    data: updated,
    message: 'Dispatched ' + weightKg + ' kg of ' + category + ' to ' + (destinationFactory || 'Recycling Mill')
  });
});

export default router;