<script setup lang="ts">
import { shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import LoginForm from '@/components/auth/LoginForm.vue'
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import { AppError } from '@/services/http/errors'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types/api'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const loading = shallowRef(false)
const fieldErrors = shallowRef<Record<string, string[]>>({})
const serverMessage = shallowRef('')

async function handleLogin(payload: LoginRequest) {
  loading.value = true
  fieldErrors.value = {}
  serverMessage.value = ''

  try {
    await auth.signIn(payload)
    const redirectTo = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirectTo)
  } catch (error) {
    if (error instanceof AppError) {
      if (error.type === 'validation') {
        fieldErrors.value = error.fieldErrors ?? {}
      } else if (error.type === 'unauthorized') {
        serverMessage.value = 'E-mail ou senha inválidos. Verifique os dados e tente novamente.'
      } else if (error.type === 'network') {
        serverMessage.value = 'Não foi possível acessar o sistema agora. Verifique sua conexão ou tente novamente em instantes.'
      } else {
        serverMessage.value = error.message
      }
    } else {
      serverMessage.value = 'Não foi possível concluir o login.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto mb-4 flex max-w-[1280px] justify-end">
      <ThemeToggle />
    </div>

    <div class="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1280px] gap-4 lg:grid-cols-[minmax(0,1fr)_460px]">
      <section
        class="surface-card order-2 flex p-6 lg:order-1 lg:p-12"
        :style="{ background: 'var(--sidebar-bg)', color: 'var(--sidebar-text)' }"
      >
        <div class="flex w-full flex-col justify-between">
          <div class="space-y-6">
            <div class="space-y-3">
              <p class="text-[11px] font-semibold uppercase tracking-[0.28em]" :style="{ color: 'var(--sidebar-muted)' }">
                SmartSindico
              </p>
              <h1 class="font-display text-4xl leading-tight sm:text-5xl">
                Acesso ao ambiente institucional
              </h1>
              <p class="max-w-xl text-sm leading-7 sm:text-base" :style="{ color: 'var(--sidebar-muted)' }">
                Área destinada à autenticação de usuários autorizados.
              </p>
            </div>

            <div class="grid gap-4 md:max-w-xl">
              <div
                class="rounded-xl border p-5"
                :style="{ borderColor: 'var(--sidebar-border)', background: 'var(--secondary-button-inverted-bg)' }"
              >
                <p class="text-[11px] font-semibold uppercase tracking-[0.22em]" :style="{ color: 'var(--sidebar-muted)' }">
                  Orientação
                </p>
                <p class="mt-3 text-sm leading-7">
                  Utilize suas credenciais para iniciar a sessão e acessar os recursos disponíveis para o seu perfil.
                </p>
              </div>

              <div
                class="rounded-xl border p-5"
                :style="{ borderColor: 'var(--sidebar-border)', background: 'var(--secondary-button-inverted-bg)' }"
              >
                <p class="text-[11px] font-semibold uppercase tracking-[0.22em]" :style="{ color: 'var(--sidebar-muted)' }">
                  Suporte
                </p>
                <p class="mt-3 text-sm leading-7">
                  Em caso de indisponibilidade ou divergência de acesso, contate a administração responsável.
                </p>
              </div>
            </div>
          </div>

          <div class="border-t pt-6" :style="{ borderColor: 'var(--sidebar-border)' }">
            <p class="text-xs uppercase tracking-[0.22em]" :style="{ color: 'var(--sidebar-muted)' }">Ambiente</p>
            <p class="mt-2 text-sm leading-6" :style="{ color: 'var(--sidebar-muted)' }">
              Sessão autenticada, navegação protegida e acesso controlado conforme permissões vigentes.
            </p>
          </div>
        </div>
      </section>

      <section class="surface-card order-1 flex items-center p-6 sm:p-8 lg:order-2">
        <div class="mx-auto w-full max-w-sm space-y-8">
          <div class="space-y-3">
            <p class="section-kicker">Identificação</p>
            <h2 class="font-display text-3xl text-ink-950">Entrar</h2>
            <p class="text-sm leading-6 text-app-secondary">
              Informe seus dados de acesso para continuar.
            </p>
          </div>

          <LoginForm
            :loading="loading"
            :field-errors="fieldErrors"
            :server-message="serverMessage"
            @submit="handleLogin"
          />
        </div>
      </section>
    </div>
  </div>
</template>
