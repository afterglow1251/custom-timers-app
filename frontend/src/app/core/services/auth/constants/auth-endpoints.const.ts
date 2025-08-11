export const AUTH_ENDPOINTS = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  refresh: '/api/auth/refresh',
  logout: '/api/auth/logout',
  checkEmail: '/api/auth/check-email',
} as const;

export const AUTH_WHITELIST = [
  AUTH_ENDPOINTS.login,
  AUTH_ENDPOINTS.register,
  AUTH_ENDPOINTS.refresh,
  AUTH_ENDPOINTS.checkEmail,
] as const;
