import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { handleMock } from './mockApi';

const IS_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Adaptador mock ───────────────────────────────────────────────────────────
// Intercepta todas las peticiones cuando VITE_USE_MOCK=true y devuelve
// respuestas simuladas sin tocar el servidor real.

if (IS_MOCK) {
  api.defaults.adapter = async (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    const method = config.method ?? 'get';
    const url = config.url ?? '';
    const body =
      config.data
        ? typeof config.data === 'string'
          ? JSON.parse(config.data)
          : config.data
        : undefined;

    // Pequeño delay para simular latencia de red (~200ms)
    await new Promise((r) => setTimeout(r, 200));

    const result = handleMock(method, url, body);

    if (!result) {
      // Endpoint no mockeado → devuelve error amigable
      return Promise.reject({
        response: {
          data: { success: false, message: `[Mock] Endpoint no implementado: ${method.toUpperCase()} ${url}` },
          status: 501,
          statusText: 'Not Implemented',
          headers: {},
          config,
        },
        config,
        isAxiosError: true,
      });
    }

    if (result.status >= 400) {
      return Promise.reject({
        response: {
          data: result.data,
          status: result.status,
          statusText: 'Error',
          headers: {},
          config,
        },
        config,
        isAxiosError: true,
      });
    }

    return {
      data: result.data,
      status: result.status,
      statusText: 'OK',
      headers: {},
      config,
    } as AxiosResponse;
  };
}

// ─── Interceptor de peticiones: adjunta el token JWT ─────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Interceptor de respuestas: maneja 401 ────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/api/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
