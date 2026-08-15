import { Router } from 'express';
import { findUserByEmail } from '../store/usersStore.js';
import { createSessionToken, readSessionToken } from '../utils/session.js';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'invalid credentials' });
  }

  const token = createSessionToken(user);

  return res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

router.post('/logout', (_req, res) => {
  return res.json({ message: 'Logged out' });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const session = readSessionToken(token);

  if (!session) {
    return res.status(401).json({ message: 'not authenticated' });
  }

  return res.json({ user: session });
});

export default router;