<script setup lang="ts">
import { shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import LoginForm from '@/components/auth/LoginForm.vue'
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
    <div class="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1280px] gap-4 lg:grid-cols-[minmax(0,1fr)_460px]">
      <section class="flex rounded-2xl bg-ink-950 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.24)] lg:p-12">
        <div class="flex w-full flex-col justify-between">
          <div class="space-y-6">
            <div class="space-y-3">
              <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                SmartSindico
              </p>
              <h1 class="font-display text-4xl leading-tight sm:text-5xl">
                Acesso ao ambiente institucional
              </h1>
              <p class="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Área destinada à autenticação de usuários autorizados.
              </p>
            </div>

            <div class="grid gap-4 md:max-w-xl">
              <div class="rounded-xl border border-white/10 bg-white/5 p-5">
                <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Orientação
                </p>
                <p class="mt-3 text-sm leading-7 text-slate-100">
                  Utilize suas credenciais para iniciar a sessão e acessar os recursos disponíveis para o seu perfil.
                </p>
              </div>

              <div class="rounded-xl border border-white/10 bg-white/5 p-5">
                <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Suporte
                </p>
                <p class="mt-3 text-sm leading-7 text-slate-100">
                  Em caso de indisponibilidade ou divergência de acesso, contate a administração responsável.
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-white/10 pt-6">
            <p class="text-xs uppercase tracking-[0.22em] text-slate-400">Ambiente</p>
            <p class="mt-2 text-sm leading-6 text-slate-200">
              Sessão autenticada, navegação protegida e acesso controlado conforme permissões vigentes.
            </p>
          </div>
        </div>
      </section>

      <section class="surface-card flex items-center p-6 sm:p-8">
        <div class="mx-auto w-full max-w-sm space-y-8">
          <div class="space-y-3">
            <p class="section-kicker">Identificação</p>
            <h2 class="font-display text-3xl text-ink-950">Entrar</h2>
            <p class="text-sm leading-6 text-ink-700">
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
