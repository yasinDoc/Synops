import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: 'email and role are required' });
  }

  return res.json({
    message: 'Login stub ready for sprint development',
    user: {
      id: 1,
      name: 'Demo User',
      email,
      role,
      token: 'dev-token-placeholder'
    }
  });
});

export default router;