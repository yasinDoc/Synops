import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';
import thesisRouter from './routes/theses.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api', (_req, res) => {
    res.json({ name: 'Synops API', status: 'ready' });
  });

  app.use('/api/health', healthRouter);
  app.use('/api/theses', thesisRouter);

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  return app;
}
