const TOKEN_KEY = 'tm-auth-token'

export type ApiErrorBody = {
  success: false
  message: string
  errors?: { path?: string; message: string }[] | null
}

export class ApiRequestError extends Error {
  status: number
  errors: ApiErrorBody['errors']

  constructor(status: number, message: string, errors: ApiErrorBody['errors'] = null) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY)
    else localStorage.setItem(TOKEN_KEY, token)
  } catch {
    /* ignore */
  }
}

function apiBase() {
  return (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || '/api'
}

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.auth !== false) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${apiBase()}${path.startsWith('/') ? path : `/${path}`}`, {
    method: options.method || (options.body !== undefined ? 'POST' : 'GET'),
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  let json: { success?: boolean; message?: string; data?: T; errors?: ApiErrorBody['errors'] } = {}
  try {
    json = await res.json()
  } catch {
    /* empty */
  }

  if (!res.ok || json.success === false) {
    throw new ApiRequestError(
      res.status,
      json.message || res.statusText || 'Request failed',
      json.errors ?? null,
    )
  }

  return json.data as T
}
