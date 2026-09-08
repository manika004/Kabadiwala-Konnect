import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai';
import ratesRoutes from './routes/rates';
import usersRoutes from './routes/users';
import pickupsRoutes from './routes/pickups';
import receiptsRoutes from './routes/receipts';
import inventoryRoutes from './routes/inventory';
import analyticsRoutes from './routes/analytics';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Kabadiwala Konnect API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/ai', aiRoutes);
app.use('/api/rates', ratesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/pickups', pickupsRoutes);
app.use('/api/receipts', receiptsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/analytics', analyticsRoutes);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('Kabadiwala Konnect Backend running on http://localhost:' + PORT);
  });
}
export default app;
