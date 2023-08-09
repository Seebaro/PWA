import { createMemoryHistory, createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import LoginPage from '@/views/LoginPage.vue';
import { useUserStore } from '@/stores/user';
import TabList from '@/views/TabList.vue';
import TabSettings from '@/views/TabSettings.vue';
import ItemPage from '@/views/ItemPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/app',
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/app',
      },
      {
        path: 'settings',
        component: TabSettings,
      },
      {
        path: 'item/:item',
        props: true,
        component: ItemPage
      },
      {
        path: 'item/:item',
        props: true,
        component: ItemPage
      },
      {
        path: ':type',
        component: TabList,
        props: true
      },
    ],
  },
]

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // Redirect to /login if the user is not authenticated and trying to access any other page
  if (!userStore.isAuthenticated && to.path !== '/login') {
    next('/login');
    return;
  }

  // If the user is authenticated and trying to access /login, redirect them to the home page
  if (userStore.isAuthenticated && to.path === '/login') {
    next('/');
    return;
  }

  // For any other condition, just continue the navigation
  next();
});


export default router
