import AuthLayout from '@/layouts/AuthLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteLocationNormalizedGeneric, RouteRecordRaw } from 'vue-router';
import adminRoutes from './modules/admin.routes.js';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'login',
    redirect: '/login'
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import ('../views/auth/LoginPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import ('../views/HomePage.vue'),
        meta: { title: 'Inicio'}
      },
      ...adminRoutes,
    ]
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

function setDocumentTitle(title: string | unknown) {
  const appName = import.meta.env.VITE_APP_NAME;
  document.title = title ? `${title} | ${appName}` : appName;
}

router.beforeEach((to: RouteLocationNormalizedGeneric, from, next) => {
  setDocumentTitle(to.meta.title);
  next();
});

/**
 * Carga rutas dinámicas en función de los roles del usuario
 * @param {string[]} roles - Ej. ['admin', 'editor']
 */
export async function loadRoleRoutes(routeModules: any = []) {
  for (const routeModule of routeModules) {
    try {
      const module = await import(/* @vite-ignore */`./modules/${routeModule}`)
      const routeRoutes = module.default

      routeRoutes.forEach((route: any) => {
        if (!router.hasRoute(route?.name)) {
          router.addRoute(route)
        }
      })
    } catch (error: any) {
      console.warn(`Error cargando rutas del rol "${routeModule}":`, error)
    }
  }
}


export default router
