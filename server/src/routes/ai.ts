import { Router } from 'express';
import { classifyWasteImage, getDemoSamples } from '../services/classifier';

const router = Router();

router.get('/samples', (_req, res) => {
  res.json({
    success: true,
    samples: getDemoSamples()
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