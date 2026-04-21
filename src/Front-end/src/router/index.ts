import { createRouter, createWebHistory } from 'vue-router'

import AppShell from '@/components/layout/AppShell.vue'
import { NOTICE_MANAGER_ROLES, USER_ROLES } from '@/constants/roles'
import { registerNavigator } from '@/services/navigation'
import { useAuthStore } from '@/stores/auth'
import { resolveGuardRedirect } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        title: 'Entrar',
        anonymousOnly: true,
      },
    },
    {
      path: '/',
      component: AppShell,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: {
            title: 'Tela inicial',
          },
        },
        {
          path: 'perfil',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
          meta: {
            title: 'Perfil',
          },
        },
        {
          path: 'avisos',
          name: 'notices',
          component: () => import('@/views/NoticesView.vue'),
          meta: {
            title: 'Avisos',
          },
        },
        {
          path: 'avisos/:id',
          name: 'notice-detail',
          component: () => import('@/views/NoticeDetailView.vue'),
          meta: {
            title: 'Aviso',
          },
        },
        {
          path: 'usuarios',
          name: 'users',
          component: () => import('@/views/UsersView.vue'),
          meta: {
            title: 'Usuários',
            allowedRoles: [USER_ROLES.Funcionario, USER_ROLES.Sindico],
          },
        },
        {
          path: 'avisos/novo',
          redirect: { name: 'notices' },
          meta: {
            allowedRoles: NOTICE_MANAGER_ROLES,
          },
        },
      ],
    },
    {
      path: '/erro/403',
      name: 'error-403',
      component: () => import('@/views/errors/Error403View.vue'),
      meta: {
        title: 'Acesso negado',
      },
    },
    {
      path: '/erro/500',
      name: 'error-500',
      component: () => import('@/views/errors/Error500View.vue'),
      meta: {
        title: 'Erro interno',
      },
    },
    {
      path: '/nao-encontrado',
      name: 'error-404',
      component: () => import('@/views/errors/Error404View.vue'),
      meta: {
        title: 'Nao encontrado',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/nao-encontrado',
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  auth.bootstrapSession()

  return resolveGuardRedirect(to, {
    isAuthenticated: auth.isAuthenticated,
    role: auth.role,
  })
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} | SmartSindico`
  }
})

registerNavigator((to) => {
  if (router.currentRoute.value.fullPath !== to) {
    return router.push(to)
  }
})

export { router }
