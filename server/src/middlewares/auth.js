import { readSessionToken } from '../utils/session.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const session = readSessionToken(token);

  if (!session) {
    return res.status(401).json({ message: 'authentication required' });
  }

  req.user = session;
  return next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role || req.headers['x-user-role'];

    if (!role) {
      return res.status(401).json({ message: 'role is required for this sprint starter' });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'not allowed for this role' });
    }

    req.user = req.user || {
      id: Number(req.headers['x-user-id'] || 1),
      role
    };

    return next();
  };
}