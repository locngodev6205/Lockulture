import { env } from '@/config/env';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
// Caller supplies token and validates the DTO against its feature schema.
export async function requestJson<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const controller = options.signal ? null : new AbortController();
  const timer = controller ? setTimeout(() => controller.abort(), 15000) : null;
  try {
    const response = await fetch(
      `${env.apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`,
      {
        ...options,
        headers,
        signal: options.signal ?? controller?.signal,
      },
    );
    if (!response.ok) throw new ApiError(response.status, `Yêu cầu thất bại (${response.status}).`);
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}
