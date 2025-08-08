export const SESSION_COOKIE_KEY = 'koa:sess';

export const SESSION_CONFIG = {
  key: SESSION_COOKIE_KEY,
  maxAge: 86400000,
  httpOnly: true,
  signed: true,
};
