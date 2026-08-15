import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import commentsRouter from './routes/comments.js';
import similarityRouter from './routes/similarity.js';
import notificationsRouter from './routes/notifications.js';
import defenseRouter from './routes/defense.js';
import evaluationRouter from './routes/evaluation.js';
import healthRouter from './routes/health.js';
import thesisRouter from './routes/theses.js';
import submissionsRouter from './routes/submissions.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api', (_req, res) => {
    res.json({ name: 'Synops API', status: 'ready' });
  });

  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/theses', thesisRouter);
  app.use('/api/submissions', submissionsRouter);
  app.use('/api/comments', commentsRouter);
  app.use('/api/similarity', similarityRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/defense', defenseRouter);
  app.use('/api/evaluation', evaluationRouter);

  app.use((error, _req, res, next) => {
    if (!error) {
      next();
      return;
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ message: 'File is too large. Max size is 20MB.' });
      return;
    }

    res.status(400).json({ message: error.message || 'Request failed' });
  });

  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  return app;
}
