import type { User } from '../types';

interface JWTPayload {
  userId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): User | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload: JWTPayload = JSON.parse(jsonPayload);

    return {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload: JWTPayload = JSON.parse(jsonPayload);
    const now = Date.now() / 1000;

    return payload.exp < now;
  } catch (error) {
    return true;
  }
};
