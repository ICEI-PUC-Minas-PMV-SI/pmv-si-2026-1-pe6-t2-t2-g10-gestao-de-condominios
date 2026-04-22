<script setup lang="ts">
import { computed } from 'vue'

import type { UsuarioResponse } from '@/types/api'
import { formatApartment, formatRole } from '@/utils/formatters'

const props = defineProps<{
  users: UsuarioResponse[]
  selectedUserId?: number | null
}>()

const emit = defineEmits<{
  edit: [user: UsuarioResponse]
}>()

const usersWithStatus = computed(() => props.users)
</script>

<template>
  <div class="space-y-3">
    <div class="grid gap-3 md:hidden">
      <article
        v-for="user in usersWithStatus"
        :key="user.id"
        tabindex="0"
        class="surface-card cursor-pointer p-4 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/70"
        :class="user.id === selectedUserId ? 'border-brand-300' : ''"
        @click="emit('edit', user)"
        @keydown.enter.prevent="emit('edit', user)"
        @keydown.space.prevent="emit('edit', user)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="truncate text-base font-semibold text-app-primary">{{ user.nome }}</h3>
            <p class="mt-1 text-sm text-app-secondary">{{ user.email }}</p>
          </div>

          <span
            class="pill shrink-0"
            :class="user.ativo ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'"
          >
            {{ user.ativo ? 'Ativo' : 'Inativo' }}
          </span>
        </div>

        <dl class="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt class="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-tertiary">Perfil</dt>
            <dd class="mt-1 text-sm text-app-secondary">{{ formatRole(user.perfil) }}</dd>
          </div>
          <div>
            <dt class="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-tertiary">Apartamento</dt>
            <dd class="mt-1 text-sm text-app-secondary">{{ formatApartment(user.idApartamento) }}</dd>
          </div>
        </dl>

        <div class="mt-4 flex justify-end">
          <button
            type="button"
            class="theme-secondary-button px-3 py-2"
            @click.stop="emit('edit', user)"
          >
            Editar
          </button>
        </div>
      </article>
    </div>

    <div class="hidden overflow-hidden rounded-xl border md:block" :style="{ borderColor: 'var(--panel-border-strong)', background: 'var(--panel-bg)' }">
      <table class="min-w-full divide-y" :style="{ borderColor: 'var(--panel-border-strong)' }">
        <thead :style="{ background: 'var(--panel-muted-bg)' }">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-app-tertiary">Nome</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-app-tertiary">Perfil</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-app-tertiary">E-mail</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-app-tertiary">Apartamento</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-app-tertiary">Status</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-app-tertiary">Ação</th>
          </tr>
        </thead>
        <tbody class="divide-y" :style="{ borderColor: 'var(--panel-border-strong)' }">
          <tr
            v-for="user in usersWithStatus"
            :key="user.id"
            tabindex="0"
            class="cursor-pointer transition hover:bg-slate-50/60 focus:outline-none focus-visible:bg-slate-50/60"
            :class="user.id === selectedUserId ? 'bg-brand-50/60' : ''"
            @click="emit('edit', user)"
            @keydown.enter.prevent="emit('edit', user)"
            @keydown.space.prevent="emit('edit', user)"
          >
            <td class="px-4 py-4 text-sm font-medium text-app-primary">{{ user.nome }}</td>
            <td class="px-4 py-4 text-sm text-app-secondary">{{ formatRole(user.perfil) }}</td>
            <td class="px-4 py-4 text-sm text-app-secondary">{{ user.email }}</td>
            <td class="px-4 py-4 text-sm text-app-secondary">{{ formatApartment(user.idApartamento) }}</td>
            <td class="px-4 py-4 text-sm">
              <span
                class="pill"
                :class="user.ativo ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'"
              >
                {{ user.ativo ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-4 py-4 text-right text-sm">
              <button
                type="button"
                class="theme-secondary-button px-3 py-2"
                @click.stop="emit('edit', user)"
              >
                Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
