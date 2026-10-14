/**
 * OneStop SACCO — typed API client for the Next.js frontend.
 * Base URL is read from NEXT_PUBLIC_API_URL (set in .env.local).
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

// ── Token storage (client-side only) ─────────────────────────────────────────

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('onestop_access_token');
}

export function setTokens(access: string, refresh: string) {
  sessionStorage.setItem('onestop_access_token', access);
  // Refresh token stored in an httpOnly cookie in production.
  // For local dev we store it in sessionStorage.
  sessionStorage.setItem('onestop_refresh_token', refresh);
}

export function clearTokens() {
  sessionStorage.removeItem('onestop_access_token');
  sessionStorage.removeItem('onestop_refresh_token');
}

// ── Base fetch wrapper ────────────────────────────────────────────────────────

interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth = false, ...init } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new ApiError(response.status, error.detail ?? 'Request failed', error);
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ── Typed error ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    role: string;
    tenantId: string;
  };
}

export const authApi = {
  login: (body: LoginRequest) =>
    apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
      skipAuth: true,
    }),

  refresh: (refreshToken: string) =>
    apiFetch<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      skipAuth: true,
    }),
};

// ── Members ───────────────────────────────────────────────────────────────────

export const membersApi = {
  list: (params?: { page?: number; size?: number; search?: string }) => {
    const qs = new URLSearchParams(
      Object.entries(params ?? {}).map(([k, v]) => [k, String(v)]),
    ).toString();
    return apiFetch<unknown>(`/members${qs ? `?${qs}` : ''}`);
  },
  get: (id: string) => apiFetch<unknown>(`/members/${id}`),
};

// ── Loans ─────────────────────────────────────────────────────────────────────

export const loansApi = {
  list: () => apiFetch<unknown>('/loans'),
  get: (id: string) => apiFetch<unknown>(`/loans/${id}`),
};

// ── Reconciliation ────────────────────────────────────────────────────────────

export const reconApi = {
  listImports: () => apiFetch<unknown>('/reconciliation/imports'),
  listExceptions: () => apiFetch<unknown>('/reconciliation/exceptions'),
};

// ── CRM ───────────────────────────────────────────────────────────────────────

export const crmApi = {
  listCases: () => apiFetch<unknown>('/crm/cases'),
  getCase: (id: string) => apiFetch<unknown>(`/crm/cases/${id}`),
};
