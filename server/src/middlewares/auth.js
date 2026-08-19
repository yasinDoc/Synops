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
  const roles = allowedRoles.flat().map((r) => r.toLowerCase());

  return (req, res, next) => {
    // If not authenticated yet via header, check token if present
    if (!req.user) {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      const session = readSessionToken(token);
      if (session) {
        req.user = session;
      }
    }

    const role = req.user?.role || req.headers['x-user-role'];

    if (!role) {
      return res.status(401).json({ message: 'role is required for this sprint starter' });
    }

    const normalizedRole = String(role).toLowerCase();

    if (roles.length > 0 && !roles.includes(normalizedRole)) {
      return res.status(403).json({ message: 'not allowed for this role' });
    }

    req.user = req.user || {
      id: Number(req.headers['x-user-id'] || 1),
      role: normalizedRole
    };

    return next();
  };
}

export const roleMiddleware = requireRole;
export const authMiddleware = requireAuth;