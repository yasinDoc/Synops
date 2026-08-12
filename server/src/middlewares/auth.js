export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.headers['x-user-role'];

    if (!role) {
      return res.status(401).json({ message: 'role header is required for this sprint starter' });
    }

    req.user = {
      id: Number(req.headers['x-user-id'] || 1),
      role
    };

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'not allowed for this role' });
    }

    return next();
  };
}