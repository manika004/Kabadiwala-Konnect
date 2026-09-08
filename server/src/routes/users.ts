import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: db.getUsers()
  });
});

router.get('/collectors', (_req, res) => {
  res.json({
    success: true,
    data: db.getCollectors()
  });
});

router.patch('/:id/online', (req, res) => {
  const { id } = req.params;
  const { isOnline } = req.body;

  if (typeof isOnline !== 'boolean') {
    return res.status(400).json({ success: false, message: 'isOnline must be a boolean' });
  }

  const updated = db.updateUserStatus(id, isOnline);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({
    success: true,
    data: updated
  });
});

export default router;