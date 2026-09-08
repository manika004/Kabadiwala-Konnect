import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (req, res) => {
  let receipts = db.getReceipts();
  const { customerId, collectorId } = req.query;

  if (customerId) {
    receipts = receipts.filter(r => r.customerId === customerId);
  }
  if (collectorId) {
    receipts = receipts.filter(r => r.collectorId === collectorId);
  }

  res.json({
    success: true,
    data: receipts
  });
});

router.get('/:id', (req, res) => {
  const receipt = db.getReceiptById(req.params.id);
  if (!receipt) {
    return res.status(404).json({ success: false, message: 'Receipt not found' });
  }
  return res.json({ success: true, data: receipt });
});

export default router;