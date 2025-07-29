import AuthLayout from '@/layouts/AuthLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import ('../views/LoginPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: 'folder/Inbox'
      },
      {
        path: 'folder/:id',
        component: () => import ('../views/FolderPage.vue')
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
