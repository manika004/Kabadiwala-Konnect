import { Router } from 'express';
import { classifyWasteImage, DEMO_SAMPLES } from '../services/classifier';

const router = Router();

router.get('/samples', (_req, res) => {
  res.json({
    success: true,
    samples: DEMO_SAMPLES
  });
});

router.post('/classify', (req, res) => {
  const { image, sampleId } = req.body;
  const result = classifyWasteImage(sampleId || image);
  res.json({
    success: true,
    data: result
  });
});

export default router;