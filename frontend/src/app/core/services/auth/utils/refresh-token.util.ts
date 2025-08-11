import { jwtDecode } from 'jwt-decode';

const MS_IN_SEC = 1000;
const REFRESH_THRESHOLD_MS = 60 * MS_IN_SEC;

function getMsUntilExpiration(token: string): number {
  const { exp } = jwtDecode<{ exp: number }>(token);
  return exp * MS_IN_SEC - Date.now();
}

export function scheduleTokenRefresh(
  token: string,
  refreshFn: () => Promise<string>,
  onNewToken: (newToken: string) => void
): ReturnType<typeof setTimeout> | null {
  const msLeft = getMsUntilExpiration(token);
  const refreshIn = msLeft - REFRESH_THRESHOLD_MS;

  if (refreshIn <= 0) {
    refreshFn()
      .then(onNewToken)
      .catch((err) => {
        console.error('Failed to refresh token', err);
      });
    return null;
  }

  return setTimeout(() => {
    refreshFn()
      .then(onNewToken)
      .catch((err) => {
        console.error('Failed to refresh token', err);
      });
  }, refreshIn);
}
