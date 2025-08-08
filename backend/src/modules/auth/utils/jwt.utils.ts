import jwt, { SignOptions } from 'jsonwebtoken';
import { getEnvOrThrow } from '../../../common/utils/env';
import { MyJwtPayload } from '../types/jwt';

const ACCESS_SECRET = getEnvOrThrow('ACCESS_SECRET');
const REFRESH_SECRET = getEnvOrThrow('REFRESH_SECRET');

const ACCESS_TOKEN_EXPIRATION = getEnvOrThrow(
  'ACCESS_TOKEN_EXPIRATION',
) as SignOptions['expiresIn'];
const REFRESH_TOKEN_EXPIRATION = getEnvOrThrow(
  'REFRESH_TOKEN_EXPIRATION',
) as SignOptions['expiresIn'];

export function generateAccessToken(payload: MyJwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
}

export function generateRefreshToken(payload: MyJwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
}

export function verifyAccessToken(token: string): MyJwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as MyJwtPayload;
}

export function verifyRefreshToken(token: string): MyJwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as MyJwtPayload;
}
