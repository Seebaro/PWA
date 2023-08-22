import type { MApp, MAppManifest, MToken } from "@/models"
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, Method, RawAxiosRequestHeaders } from "axios"
import { ref } from "vue"

class APIService {
    private api: AxiosInstance
    token = ref<string | undefined>()
    refresh = ref<string | undefined>()

    constructor() {
      this.api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  
    private get headers(): RawAxiosRequestHeaders {
      if (this.token.value === undefined) {
        return {}
      }
      return {
        Authorization: 'Bearer ' + this.token.value
      }
    }
  
    private async request<T>(resource: string, method: Method, opts: AxiosRequestConfig = {}) {
      const o: AxiosRequestConfig = opts ?? {}
      o.method = method
      o.url = resource
      o.headers = this.headers
      try {
        const response = await this.api.request(o)
        return response.data
      } catch (err) {
        const error = err as AxiosError
        if (error.response && error.response.status === 401) {
          try {
            await this.refreshToken()
          } catch (err) {
            const error = err as AxiosError
            if (error.response && error.response.status === 401) {
              this.refresh.value = undefined
              this.token.value = undefined
              throw error
            }
            throw error
          }
          const response = await this.api.request(o)
          return response.data
        }
        throw err
      }
    }
  
    private async get<T>(resource: string, params = {}): Promise<T> {
      return await this.request(resource, 'GET', { params })
    }
  
    private async post<T, D>(resource: string, data: D): Promise<T> {
      return await this.request(resource, 'POST', { data })
    }
  
    private async patch<T, D>(resource: string, data: D): Promise<T> {
      return await this.request(resource, 'PATCH', { data })
    }
  
    private async delete<T>(resource: string): Promise<T> {
      return await this.request(resource, 'DELETE')
    }

    private async refreshToken() {
        const response: MToken = await this.post('/token/refresh/', { refresh: this.refresh.value })
        this.token.value = response.access
    }

    // METHODS

  async login(username: string, password: string) {
    const response: MToken = await this.post('/token/', { username, password })
    this.refresh.value = response.refresh
    this.token.value = response.access
  }

  // async verify(): Promise<boolean> {
  //     try {
  //         await this.post('/token/verify/', { token: this.token.value })
  //         return true
  //     } catch (err) {
  //         const error = err as AxiosError
  //         if (error.response && error.response.status === 401)
  //             return false
  //         throw err
  //     }
  // }

  async apps(): Promise<MApp[]> {
    const response: MApp[] = await this.get('/applications/');
    return response
  }

  async manifest(appId: number): Promise<string> {
    const response: MAppManifest = await this.get(`/applications/${appId}/`)
    return response.manifest
  }

  async suggest(name: string, link?: string, description?: string) {
    await this.post(`/suggestions/`, { name, link, description })
  }
    
}

export default new APIService()