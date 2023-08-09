<template>
  <ion-app>
    <user-agent-page v-if="!util.userAgent.iOS || !util.userAgent.standalone"></user-agent-page>
    <s-w-update-page @update="updateServiceWorker()" v-else-if="needRefresh"></s-w-update-page>
    <ion-router-outlet v-else />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useUserStore } from './stores/user';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import UserAgentPage from './views/UserAgentPage.vue';
import util from './util';

const router = useRouter();
const userStore = useUserStore()

watch(() => userStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && router.currentRoute.value.path === '/login') {
    // If user just authenticated, redirect from login to home
    router.replace('/');
  } else if (!isAuthenticated && router.currentRoute.value.path !== '/login') {
    // If user just got unauthenticated, redirect to login
    router.replace('/login');
  }
});

import { useRegisterSW } from 'virtual:pwa-register/vue'
import SWUpdatePage from './views/SWUpdatePage.vue';

const {
  needRefresh,
  updateServiceWorker
} = useRegisterSW()
</script>

<style>
ion-title {
  line-height: 1;
}
</style>