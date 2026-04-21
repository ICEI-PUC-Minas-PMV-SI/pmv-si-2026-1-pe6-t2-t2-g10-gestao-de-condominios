<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { formatRole } from '@/utils/formatters'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const navigationItems = computed(() => [
  { label: 'Tela inicial', to: '/' },
  { label: 'Perfil', to: '/perfil' },
  { label: 'Comunicados', to: '/avisos' },
  ...(auth.role === 'Funcionario' || auth.role === 'Sindico'
    ? [{ label: 'Usuários', to: '/usuarios' }]
    : []),
])

const heading = computed(() => auth.usuario?.nome?.split(' ')[0] ?? 'Usuário')
async function handleLogout() {
  auth.clearSession()
  await router.push('/login')
}
</script>

<template>
  <div class="min-h-screen px-4 py-4 text-ink-900 sm:px-6 lg:px-8">
    <div class="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1440px] flex-col gap-4 lg:flex-row">
      <aside class="flex w-full flex-col justify-between rounded-2xl bg-ink-950 px-5 py-6 text-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.22)] lg:w-[280px]">
        <div class="space-y-8">
          <div class="space-y-5 border-b border-white/10 pb-6">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                  SmartSindico
                </p>
                <h1 class="mt-2 font-display text-2xl text-white">Portal</h1>
              </div>
              <span class="rounded-md border border-white/12 bg-white/6 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                {{ formatRole(auth.role ?? 'Morador') }}
              </span>
            </div>

            <div class="rounded-xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Usuário</p>
              <p class="mt-2 text-lg font-semibold text-white">{{ heading }}</p>
            </div>
          </div>

          <nav class="space-y-2">
            <RouterLink
              v-for="item in navigationItems"
              :key="item.to"
              :to="item.to"
              class="soft-ring block rounded-xl px-4 py-3 text-sm font-semibold transition"
              :class="route.path === item.to ? 'bg-brand-600 text-white' : 'text-slate-200 hover:bg-white/6'"
            >
              {{ item.label }}
            </RouterLink>
          </nav>
        </div>

        <button
          type="button"
          class="soft-ring w-full rounded-xl border border-white/12 bg-white px-4 py-3 text-sm font-semibold text-ink-900 transition hover:bg-slate-100"
          @click="handleLogout"
        >
          Sair do portal
        </button>
      </aside>

      <main class="flex-1 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-4 sm:p-5 lg:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
