export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1').replace(/\/$/, '')
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v\d+$/, '')
const TOKEN_KEY = 'parkos.auth.token'

const extractErrorMessage = (payload) => {
  if (!payload) return 'Request failed. Please try again.'
  if (typeof payload.message === 'string') return payload.message
  if (Array.isArray(payload.message) && payload.message.length > 0) return payload.message[0]
  if (typeof payload.error?.message === 'string') return payload.error.message
  if (Array.isArray(payload.error?.message) && payload.error.message.length > 0) return payload.error.message[0]
  return 'Request failed. Please try again.'
}

export const request = async (
  path,
  { method = 'GET', body, token, isFormData = false } = {},
) => {
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload))
  }

  return payload?.data ?? payload
}

export const authTokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export const authApi = {
  login: ({ username, password }) =>
    request('/auth/login', {
      method: 'POST',
      body: { username, password },
    }),

  createLaborer: ({ username, password, token }) =>
    request('/auth/laborers', {
      method: 'POST',
      body: { username, password },
      token,
    }),

  getProfile: (token) =>
    request('/auth/profile', {
      token,
    }),
}
