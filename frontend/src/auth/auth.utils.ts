export function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function getTokenRemainingTime(token: string): number {
  const payload = parseJwt(token);
  if (!payload?.exp) return 0;
  return payload.exp * 1000 - Date.now();
}