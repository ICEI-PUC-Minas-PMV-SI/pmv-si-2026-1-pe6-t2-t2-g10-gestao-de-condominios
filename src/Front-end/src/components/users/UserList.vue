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
  <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <table class="min-w-full divide-y divide-slate-200">
      <thead class="bg-slate-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-ink-600">Nome</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-ink-600">Perfil</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-ink-600">E-mail</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-ink-600">Apartamento</th>
          <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-ink-600">Status</th>
          <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-ink-600">Ação</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200">
        <tr
          v-for="user in usersWithStatus"
          :key="user.id"
          tabindex="0"
          class="cursor-pointer transition hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50"
          :class="user.id === selectedUserId ? 'bg-brand-50/60' : ''"
          @click="emit('edit', user)"
          @keydown.enter.prevent="emit('edit', user)"
          @keydown.space.prevent="emit('edit', user)"
        >
          <td class="px-4 py-4 text-sm font-medium text-ink-950">{{ user.nome }}</td>
          <td class="px-4 py-4 text-sm text-ink-700">{{ formatRole(user.perfil) }}</td>
          <td class="px-4 py-4 text-sm text-ink-700">{{ user.email }}</td>
          <td class="px-4 py-4 text-sm text-ink-700">{{ formatApartment(user.idApartamento) }}</td>
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
              class="soft-ring rounded-lg border border-slate-300 px-3 py-2 font-semibold text-ink-900 transition hover:border-slate-400 hover:bg-slate-50"
              @click.stop="emit('edit', user)"
            >
              Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
