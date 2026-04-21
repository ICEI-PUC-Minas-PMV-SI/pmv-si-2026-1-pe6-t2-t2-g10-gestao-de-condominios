import axios from 'axios'

import { handleHttpError } from './errors'
import { readPersistedSession } from '@/utils/session-storage'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const api = axios.create({
  // Supports direct API access via backend CORS, while keeping Vite proxy as a fallback.
  baseURL: configuredBaseUrl?.length ? configuredBaseUrl : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const session = readPersistedSession()

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => handleHttpError(error),
)
