import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: db.getAnalytics()
  });
});

router.post('/reset', (_req, res) => {
  db.resetDemo();
  res.json({
    success: true,
    message: 'Demo state reset successfully'
  });
});

export default router;