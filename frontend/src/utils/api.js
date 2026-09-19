const API_BASE_URL = 'http://localhost:8080'

let expiryTimer = null

function clearExpiryTimer() {
  if (expiryTimer) {
    clearTimeout(expiryTimer)
    expiryTimer = null
  }
}

function notifySessionExpired() {
  clearExpiryTimer()

  localStorage.removeItem('token')
  localStorage.removeItem('user')

  window.dispatchEvent(
    new CustomEvent('auth:session-expired')
  )
}

function getTokenExpiry(token) {
  try {
    const payload = token.split('.')[1]

    if (!payload) {
      return null
    }

    const decodedPayload = JSON.parse(
      atob(
        payload
          .replace(/-/g, '+')
          .replace(/_/g, '/')
      )
    )

    return decodedPayload.exp || null
  } catch {
    return null
  }
}

export function startTokenExpiryTimer() {
  clearExpiryTimer()

  const token = localStorage.getItem('token')

  if (!token) {
    return
  }

  const expiryTime = getTokenExpiry(token)

  if (!expiryTime) {
    return
  }

  const millisecondsUntilExpiry =
    expiryTime * 1000 - Date.now()

  if (millisecondsUntilExpiry <= 0) {
    notifySessionExpired()
    return
  }

  expiryTimer = setTimeout(
    () => {
      notifySessionExpired()
    },
    millisecondsUntilExpiry
  )
}

export function logoutUser() {
  clearExpiryTimer()

  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export async function apiFetch(
  endpoint,
  options = {}
) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  )

  if (response.status === 401) {
    notifySessionExpired()
  }

  return response
}

startTokenExpiryTimer()