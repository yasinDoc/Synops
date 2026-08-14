import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'synops-server',
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
