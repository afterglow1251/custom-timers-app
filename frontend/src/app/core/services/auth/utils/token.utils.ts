import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number;
}

export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function isValidToken(token: string | null): token is string {
  return !!token && !isTokenExpired(token);
}
