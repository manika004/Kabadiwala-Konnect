import { Router } from 'express';
import { db } from '../db';
import { MaterialCategory } from '../types';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: db.getRates()
  });
});

router.put('/:category', (req, res) => {
  const category = req.params.category as MaterialCategory;
  const { ratePerKg } = req.body;

  if (typeof ratePerKg !== 'number' || ratePerKg <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid ratePerKg value' });
  }

  const updated = db.updateRate(category, ratePerKg);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  return res.json({
    success: true,
    data: updated,
    message: 'Updated rate for ' + updated.name + ' to ₹' + ratePerKg + '/kg'
  });
});

export default router;