export function createSessionToken(user) {
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  ).toString('base64');

  return `synops.${payload}`;
}

export function readSessionToken(token) {
  if (!token || !token.startsWith('synops.')) {
    return null;
  }

  try {
    const payload = token.slice('synops.'.length);
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}