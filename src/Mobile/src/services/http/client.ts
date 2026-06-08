import axios from 'axios'

import { readPersistedSession } from '@/storage/session-storage'

import { normalizeHttpError } from './errors'

const configuredBaseUrl = (globalThis as any).process?.env?.EXPO_PUBLIC_API_BASE_URL?.trim()
const apiBaseUrls = (configuredBaseUrl?.length ? configuredBaseUrl : 'http://localhost:5053/api')
  .split(',')
  .map((url: string) => url.trim())
  .filter(Boolean)

export const api = axios.create({
  baseURL: apiBaseUrls[0],
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  const session = await readPersistedSession()

  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && !error.response && error.config && apiBaseUrls.length > 1) {
      const currentBaseUrl = String(error.config.baseURL ?? api.defaults.baseURL ?? '')
      const currentIndex = apiBaseUrls.indexOf(currentBaseUrl)
      const nextIndex = currentIndex >= 0 ? currentIndex + 1 : 1
      const nextBaseUrl = apiBaseUrls[nextIndex]

      if (nextBaseUrl) {
        api.defaults.baseURL = nextBaseUrl
        return api.request({
          ...error.config,
          baseURL: nextBaseUrl,
        })
      }
    }

    return normalizeHttpError(error)
  },
)
