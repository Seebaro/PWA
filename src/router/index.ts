import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/apps',
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/apps',
      },
      {
        path: 'apps',
        component: () => import('@/views/TabApps.vue'),
      },
      {
        path: 'games',
        component: () => import('@/views/TabGames.vue'),
      },
      {
        path: 'settings',
        component: () => import('@/views/TabSettings.vue'),
      },
      {
        path: 'item/:item',
        props: true,
        component: () => import('@/views/Item.vue')
      },
      {
        path: 'item/:item',
        props: true,
        component: () => import('@/views/Item.vue')
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
