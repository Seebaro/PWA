import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { computed, ref, watch } from 'vue'
import api from '@/api'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | undefined>(Cookies.get('user-access-token'))
  const refresh = ref<string | undefined>(Cookies.get('user-refresh-token'))
  const username = ref<string | undefined>(Cookies.get('user-username'))

  api.refresh.value = refresh.value
  api.token.value = token.value

  watch(() => api.refresh.value, apiRefresh => {
    refresh.value = apiRefresh
  })

  watch(() => api.token.value, apiAccess => {
    token.value = apiAccess
  })

  watch(() => token.value, token => {
    if(token) {
      Cookies.set('user-access-token', token)
    } else {
      Cookies.remove('user-access-token')
    }
  })

  watch(() => refresh.value, refresh => {
    if(refresh) {
      Cookies.set('user-refresh-token', refresh)
    } else {
      Cookies.remove('user-refresh-token')
    }
  })

  watch(() => username.value, username => {
    if(username) {
      Cookies.set('user-username', username)
    } else {
      Cookies.remove('user-username')
    }
  })
  
  function logout() {
    api.token.value = undefined
    api.refresh.value = undefined
    token.value = undefined
    refresh.value = undefined
    username.value = undefined
  }

  async function login(user: string, pass: string) {
    await api.login(user, pass)
    username.value = user
  }

  const isAuthenticated = computed(() => {
    return token.value !== undefined
  });

  return { 
    // Functions
    logout, 
    login, 
    // Computed
    isAuthenticated,
    // State
    token,
    refresh,
    username
  }
})
