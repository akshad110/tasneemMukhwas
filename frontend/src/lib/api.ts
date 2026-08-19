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
  const raw = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
  if (!raw) return '/api'

  let base = raw.replace(/\/+$/, '')
  // Ensure absolute API hosts always include the /api prefix used by Express
  if (/^https?:\/\//i.test(base) && !/\/api$/i.test(base)) {
    base = `${base}/api`
  }
  return base
}

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
  /** Internal — avoid infinite retry loops */
  _retry?: number
}

const RETRYABLE_STATUS = new Set([0, 502, 503, 504, 429])
const MAX_API_RETRIES = 6

function retryDelayMs(attempt: number) {
  return Math.min(450 * 2 ** attempt, 2800)
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

/** Ping API on auth/checkout screens so the first submit is not hit during a dev-server restart. */
export async function warmApi(maxAttempts = 8) {
  const url = `${apiBase()}/health`
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url, { method: 'GET' })
      if (res.ok) return true
    } catch {
      /* server restarting or not ready */
    }
    await sleep(500 * (i + 1))
  }
  return false
}

function filenameFromDisposition(header: string | null) {
  if (!header) return null
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1].trim())
    } catch {
      return utf8[1].trim()
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header)
  return plain?.[1]?.trim() || null
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob)
  const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`

  try {
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = safeName
    link.rel = 'noopener'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch {
    window.open(objectUrl, '_blank', 'noopener,noreferrer')
  }

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 120_000)
}

/** Download a binary file (e.g. invoice PDF) with auth token. */
export async function apiDownload(path: string, filename: string) {
  const token = getToken()
  if (!token) {
    throw new ApiRequestError(401, 'Please sign in to download your invoice.')
  }

  const headers: Record<string, string> = {
    Accept: 'application/pdf, application/octet-stream, */*',
    Authorization: `Bearer ${token}`,
  }

  const res = await fetch(`${apiBase()}${path.startsWith('/') ? path : `/${path}`}`, {
    headers,
    credentials: 'include',
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const json = await res.json()
      message = json.message || message
    } catch {
      try {
        message = (await res.text()).slice(0, 200) || message
      } catch {
        /* ignore */
      }
    }
    throw new ApiRequestError(res.status, message)
  }

  const blob = await res.blob()
  if (!blob.size) {
    throw new ApiRequestError(500, 'Downloaded file was empty.')
  }

  const serverName = filenameFromDisposition(res.headers.get('content-disposition'))
  triggerBlobDownload(blob, serverName || filename)
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const retry = options._retry ?? 0

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

  let res: Response
  try {
    res = await fetch(`${apiBase()}${path.startsWith('/') ? path : `/${path}`}`, {
      method: options.method || (options.body !== undefined ? 'POST' : 'GET'),
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    })
  } catch {
    const err = new ApiRequestError(0, 'Could not reach the server. Wait a moment and try again.')
    if (retry < MAX_API_RETRIES - 1 && RETRYABLE_STATUS.has(err.status)) {
      await sleep(retryDelayMs(retry))
      return apiRequest<T>(path, { ...options, _retry: retry + 1 })
    }
    throw err
  }

  let json: { success?: boolean; message?: string; data?: T; errors?: ApiErrorBody['errors'] } = {}
  try {
    json = await res.json()
  } catch {
    /* empty */
  }

  if (!res.ok || json.success === false) {
    const err = new ApiRequestError(
      res.status,
      json.message || res.statusText || 'Request failed',
      json.errors ?? null,
    )
    if (retry < MAX_API_RETRIES - 1 && RETRYABLE_STATUS.has(err.status)) {
      await sleep(retryDelayMs(retry))
      return apiRequest<T>(path, { ...options, _retry: retry + 1 })
    }
    throw err
  }

  return json.data as T
}
