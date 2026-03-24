import { API_ORIGIN, request } from '@/services/authApi'

const toAbsoluteAssetUrl = (value) => {
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value
  return `${API_ORIGIN}${value}`
}

const appendIfPresent = (formData, key, value) => {
  if (value !== undefined && value !== null && value !== '') {
    formData.append(key, value)
  }
}

const appendFileIfPresent = (formData, key, file) => {
  if (file) {
    formData.append(key, file)
  }
}

export const parkingApi = {
  getActiveSessions: (token) =>
    request('/parking/active', { token }),

  getHistory: ({ token, page = 1, limit = 100, plateNumber } = {}) => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    })
    if (plateNumber) {
      query.set('plateNumber', plateNumber)
    }

    return request(`/parking/history?${query.toString()}`, { token })
  },

  getDailyStats: ({ token, date } = {}) => {
    const query = new URLSearchParams()
    if (date) query.set('date', date)

    return request(`/parking/stats${query.toString() ? `?${query.toString()}` : ''}`, { token })
  },

  checkIn: ({
    token,
    plateNumber,
    vehicleType,
    customerName,
    phoneNumber,
    dailyRate,
    rcBookPhoto,
    frontPhoto,
    rearPhoto,
    leftPhoto,
    rightPhoto,
  }) => {
    const formData = new FormData()
    appendIfPresent(formData, 'plateNumber', plateNumber)
    appendIfPresent(formData, 'vehicleType', vehicleType)
    appendIfPresent(formData, 'customerName', customerName)
    appendIfPresent(formData, 'phoneNumber', phoneNumber)
    appendIfPresent(formData, 'dailyRate', dailyRate)

    appendFileIfPresent(formData, 'rcBookPhoto', rcBookPhoto)
    appendFileIfPresent(formData, 'frontPhoto', frontPhoto)
    appendFileIfPresent(formData, 'rearPhoto', rearPhoto)
    appendFileIfPresent(formData, 'leftPhoto', leftPhoto)
    appendFileIfPresent(formData, 'rightPhoto', rightPhoto)

    return request('/parking/entry', {
      method: 'POST',
      body: formData,
      token,
      isFormData: true,
    })
  },

  checkOut: ({ token, id, note }) =>
    request(`/parking/exit/${id}`, {
      method: 'PATCH',
      body: note ? { note } : {},
      token,
    }),

  toAbsoluteAssetUrl,
}
