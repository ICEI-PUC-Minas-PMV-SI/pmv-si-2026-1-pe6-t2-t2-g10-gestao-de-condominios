<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const mobileMenuOpen = shallowRef(false)

const navigationItems = computed(() => [
  { label: 'Tela inicial', to: '/' },
  { label: 'Perfil', to: '/perfil' },
  { label: 'Comunicados', to: '/avisos' },
  ...(auth.role === 'Funcionario' || auth.role === 'Sindico'
    ? [{ label: 'Usuários', to: '/usuarios' }]
    : []),
])

const heading = computed(() => auth.usuario?.nome?.trim() ?? 'Usuário')

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false
  },
)

async function handleLogout() {
  auth.clearSession()
  await router.push('/login')
}
</script>

<template>
  <div class="min-h-screen px-4 py-4 text-app-primary sm:px-6 lg:px-8">
    <div class="mx-auto mb-4 flex max-w-[1440px] items-center justify-between gap-3 lg:hidden">
      <div class="surface-card flex min-w-0 flex-1 items-center justify-between px-4 py-3">
        <div class="min-w-0">
          <p class="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-app-tertiary">
            SmartSindico
          </p>
          <p class="truncate text-sm font-semibold text-app-primary">{{ heading }}</p>
        </div>

        <div class="ml-3 flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            class="theme-secondary-button px-3"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            Menu
          </button>
        </div>
      </div>
    </div>

    <div class="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1440px] flex-col gap-4 lg:flex-row">
      <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-[1px] lg:hidden"
        @click="mobileMenuOpen = false"
      />

      <aside
        class="theme-sidebar fixed inset-y-4 left-4 z-40 flex w-[min(84vw,320px)] flex-col justify-between border px-5 py-6 transition duration-200 lg:static lg:w-[280px] lg:translate-x-0 lg:opacity-100"
        :class="mobileMenuOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-[115%] opacity-0 lg:pointer-events-auto'"
      >
        <div class="space-y-8">
          <div class="space-y-5 border-b pb-6" :style="{ borderColor: 'var(--sidebar-border)' }">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.24em]" :style="{ color: 'var(--sidebar-muted)' }">
                  SmartSindico
                </p>
                <h1 class="mt-2 font-display text-2xl">Portal</h1>
              </div>

              <div class="hidden lg:block">
                <ThemeToggle inverted />
              </div>
            </div>

            <div class="rounded-xl border p-4" :style="{ borderColor: 'var(--sidebar-border)', background: 'var(--secondary-button-inverted-bg)' }">
              <p class="text-xs uppercase tracking-[0.22em]" :style="{ color: 'var(--sidebar-muted)' }">Usuário</p>
              <p class="mt-2 text-lg font-semibold">{{ heading }}</p>
            </div>

            <div class="lg:hidden">
              <ThemeToggle inverted full-width />
            </div>
          </div>

          <nav class="space-y-2">
            <RouterLink
              v-for="item in navigationItems"
              :key="item.to"
              :to="item.to"
              class="theme-sidebar-link"
              :class="route.path === item.to ? 'theme-sidebar-link--active' : ''"
            >
              {{ item.label }}
            </RouterLink>
          </nav>
        </div>

        <button
          type="button"
          class="theme-secondary-button w-full"
          @click="handleLogout"
        >
          Sair do portal
        </button>
      </aside>

      <main class="surface-card min-w-0 flex-1 p-4 sm:p-5 lg:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
