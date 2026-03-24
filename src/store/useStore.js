import { create } from 'zustand'
import { DAILY_RENT_PER_DAY, TOTAL_SLOTS, ROLES, TABS } from '@/constants'
import { formatTime, calculateParkingDays, calculateRentAmount } from '@/utils'
import { authApi, authTokenStorage } from '@/services/authApi'
import { parkingApi } from '@/services/parkingApi'

const roleFromBackend = (role = '') =>
  String(role).toUpperCase() === 'OWNER' ? ROLES.OWNER : ROLES.LABORER

const getInitialSessionViewMode = () => {
  if (typeof window === 'undefined') return 'list'
  const mode = window.localStorage.getItem('parkos.sessionViewMode')
  return mode === 'cards' ? 'cards' : 'list'
}

const toPhotoMeta = (url, fallbackName) =>
  url
    ? {
      name: fallbackName,
      url: parkingApi.toAbsoluteAssetUrl(url),
    }
    : null

const toSessionModel = (log) => {
  const entryDate = new Date(log.entryTime)

  return {
    id: log.id,
    plate: log.plateNumber,
    type: 'Car',
    customerName: log.customerName,
    phoneNumber: log.phoneNumber,
    slot: log.slotLabel,
    entryTime: formatTime(entryDate),
    entryDate,
    rcBookPhoto: log.rcBookPhotoUrl || null,
    carPhotos: {
      front: toPhotoMeta(log.frontPhotoUrl, 'front-photo.jpg'),
      rear: toPhotoMeta(log.rearPhotoUrl, 'rear-photo.jpg'),
      left: toPhotoMeta(log.leftPhotoUrl, 'left-photo.jpg'),
      right: toPhotoMeta(log.rightPhotoUrl, 'right-photo.jpg'),
    },
    rentPerDay: Number(log.dailyRate) || DAILY_RENT_PER_DAY,
  }
}

const toHistoryModel = (log) => {
  const entryDate = new Date(log.entryTime)
  const exitDate = log.exitTime ? new Date(log.exitTime) : new Date()
  const rentPerDay = Number(log.dailyRate) || DAILY_RENT_PER_DAY
  const parkedDays = Number(log.parkedDays) || calculateParkingDays(entryDate, exitDate)
  const rentAmount = Number(log.totalAmount) || calculateRentAmount(entryDate, rentPerDay, exitDate)

  return {
    id: log.id,
    plate: log.plateNumber,
    type: 'Car',
    customerName: log.customerName,
    phoneNumber: log.phoneNumber,
    slot: log.slotLabel,
    entryDate,
    exitDate,
    entryTime: formatTime(entryDate),
    exitTime: formatTime(exitDate),
    parkedDays,
    rentPerDay,
    rentAmount,
  }
}

const normalizeParkingPayload = ({ activePayload, historyPayload, statsPayload }) => ({
  sessions: Array.isArray(activePayload?.sessions)
    ? activePayload.sessions.map(toSessionModel)
    : [],
  history: Array.isArray(historyPayload?.records)
    ? historyPayload.records.map(toHistoryModel)
    : [],
  dailyStats: statsPayload || null,
})

export const useStore = create((set, get) => ({
  // UI state
  role: ROLES.LABORER,
  tab: TABS.HOME,
  sessionViewMode: getInitialSessionViewMode(),

  // Auth state
  isAuthenticated: false,
  currentUser: null,
  authToken: null,
  authLoading: true,

  // Parking data
  sessions: [],
  history: [],
  dailyStats: null,
  parkingLoading: false,
  parkingError: '',

  // Computed getters
  get occupiedCount() { return get().sessions.length },
  get totalRevenue() { return get().history.reduce((acc, h) => acc + (h.rentAmount ?? 0), 0) },
  get capacityPct() { return Math.round((get().sessions.length / TOTAL_SLOTS) * 100) },

  // UI actions
  setRole: (role) => set({ role, tab: TABS.HOME }),
  setTab: (tab) => set({ tab }),
  setSessionViewMode: (mode) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('parkos.sessionViewMode', mode)
    }
    set({ sessionViewMode: mode })
  },

  loadParkingData: async () => {
    const token = get().authToken
    if (!token) {
      return { success: false, message: 'Authentication token not found.' }
    }

    set({ parkingLoading: true, parkingError: '' })

    try {
      const [activePayload, historyPayload, statsPayload] = await Promise.all([
        parkingApi.getActiveSessions(token),
        parkingApi.getHistory({ token, page: 1, limit: 200 }),
        parkingApi.getDailyStats({ token }),
      ])

      const normalized = normalizeParkingPayload({
        activePayload,
        historyPayload,
        statsPayload,
      })

      set({
        ...normalized,
        parkingLoading: false,
        parkingError: '',
      })

      return { success: true }
    } catch (error) {
      set({
        parkingLoading: false,
        parkingError: error?.message || 'Unable to load parking data from server.',
      })
      return {
        success: false,
        message: error?.message || 'Unable to load parking data from server.',
      }
    }
  },

  bootstrapAuth: async () => {
    const token = authTokenStorage.get()
    if (!token) {
      set({ authLoading: false })
      return
    }

    try {
      const profile = await authApi.getProfile(token)
      const normalizedRole = roleFromBackend(profile.role)

      set({
        authToken: token,
        role: normalizedRole,
        tab: TABS.HOME,
        isAuthenticated: true,
        currentUser: {
          id: profile.id,
          username: profile.username,
          name: profile.username,
          role: normalizedRole,
          createdAt: profile.createdAt,
        },
      })

      await get().loadParkingData()
      set({ authLoading: false })
    } catch {
      authTokenStorage.clear()
      set({
        authToken: null,
        isAuthenticated: false,
        currentUser: null,
        tab: TABS.HOME,
        role: ROLES.LABORER,
        sessions: [],
        history: [],
        dailyStats: null,
        authLoading: false,
      })
    }
  },

  login: async ({ username, password }) => {
    try {
      const response = await authApi.login({ username, password })
      const token = response.accessToken
      if (!token || !response.user) {
        throw new Error('Authentication response is invalid.')
      }
      const normalizedRole = roleFromBackend(response.user?.role)

      authTokenStorage.set(token)

      set({
        authToken: token,
        role: normalizedRole,
        tab: TABS.HOME,
        isAuthenticated: true,
        currentUser: {
          id: response.user?.id,
          username: response.user?.username,
          name: response.user?.username,
          role: normalizedRole,
        },
      })

      const parkingResult = await get().loadParkingData()
      if (!parkingResult.success) {
        return {
          success: false,
          message: parkingResult.message,
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Unable to sign in. Please try again.',
      }
    }
  },

  createLaborer: async ({ username, password }) => {
    try {
      const token = get().authToken
      if (!token) {
        throw new Error('Authentication expired. Please sign in again.')
      }

      await authApi.createLaborer({
        username,
        password,
        token,
      })

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Unable to create staff account. Please try again.',
      }
    }
  },

  logout: () => {
    authTokenStorage.clear()
    set({
      authToken: null,
      isAuthenticated: false,
      currentUser: null,
      tab: TABS.HOME,
      role: ROLES.LABORER,
      authLoading: false,
      sessions: [],
      history: [],
      dailyStats: null,
      parkingLoading: false,
      parkingError: '',
    })
  },

  addSession: async ({
    plate,
    customerName,
    phoneNumber,
    rcBookPhotoFile,
    carPhotoFiles,
  }) => {
    try {
      const token = get().authToken
      if (!token) {
        throw new Error('Authentication expired. Please sign in again.')
      }

      await parkingApi.checkIn({
        token,
        plateNumber: plate.toUpperCase().trim(),
        vehicleType: 'CAR',
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        dailyRate: DAILY_RENT_PER_DAY,
        rcBookPhoto: rcBookPhotoFile,
        frontPhoto: carPhotoFiles?.front || null,
        rearPhoto: carPhotoFiles?.rear || null,
        leftPhoto: carPhotoFiles?.left || null,
        rightPhoto: carPhotoFiles?.right || null,
      })

      await get().loadParkingData()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Unable to register this car entry.',
      }
    }
  },

  checkoutSession: async (id) => {
    try {
      const token = get().authToken
      if (!token) {
        throw new Error('Authentication expired. Please sign in again.')
      }

      await parkingApi.checkOut({ token, id })
      await get().loadParkingData()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Unable to complete checkout.',
      }
    }
  },

  checkoutAll: async () => {
    const sessions = get().sessions
    for (const session of sessions) {
      const result = await get().checkoutSession(session.id)
      if (!result.success) {
        return result
      }
    }

    return { success: true }
  },
}))
