import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { computed, ref, watch } from 'vue'
import api from '@/api'
import type { MApp } from '@/models'
import { useUserStore } from './user'
import util from '@/util'


export const useApplicationStore = defineStore('application', () => {
  const applications = ref<MApp[] | Promise<MApp[]> | undefined>()

  const userStore = useUserStore()

  watch(() => userStore.isAuthenticated, isAuthenticated => {
    if (!isAuthenticated)
      applications.value = undefined
  }, { immediate: true })

  async function get(refresh: boolean = false): Promise<MApp[]> {
    const currentApplications = applications.value
    if (!refresh && currentApplications !== undefined)
      return await Promise.resolve(currentApplications)
    const promise = api.apps()
    applications.value = promise
    return await promise
  }

  async function download(app: MApp) {
    const manifest = await api.manifest(app.id)
    window.location.href = `itms-services://?action=download-manifest&url=${manifest}`
    // wait some time for system to download the manifest
    await util.delay(2000)
  }

  async function suggest(name: string, link?: string, description?: string) {
    await api.suggest(name, link, description)
  }

  return {
    // Functions
    get,
    download,
    suggest,
    // State
    applications,
  }

})
