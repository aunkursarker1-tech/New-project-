import express from 'express';
import { courierRouter } from '../src/server/courierRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Vercel Serverless Courier API', timestamp: new Date().toISOString() });
});

app.use('/api/courier', courierRouter);

export default app;
