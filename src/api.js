const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
const TOKEN_KEY = 'glws_admin_token'

async function request(path, options = {}) {
  const headers = { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) }
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_URL}/${path.replace(/^\//, '')}`, { ...options, headers })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = payload.message || Object.values(payload.errors || {}).flat().join(' ') || `Request gagal (${response.status})`
    throw new Error(message)
  }
  return payload
}

const unwrap = (payload) => payload.data ?? payload

export const api = {
  tokenKey: TOKEN_KEY,
  login: async (email, password) => {
    const result = await request('auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    localStorage.setItem(TOKEN_KEY, result.token)
    return result.admin
  },
  me: () => request('auth/me').then(unwrap),
  logout: async () => { await request('auth/logout', { method: 'POST' }); localStorage.removeItem(TOKEN_KEY) },
  list: (resource, query = '') => request(`${resource}${query}`).then(unwrap),
  create: (resource, data) => request(resource, { method: 'POST', body: JSON.stringify(data) }).then(unwrap),
  update: (resource, slug, data) => request(`${resource}/${encodeURIComponent(slug)}`, { method: 'PUT', body: JSON.stringify(data) }).then(unwrap),
  remove: (resource, slug) => request(`${resource}/${encodeURIComponent(slug)}`, { method: 'DELETE' }),
}

export function getApiError(error) {
  return error instanceof Error ? error.message : 'Terjadi kesalahan koneksi API.'
}
