<template>
  <section class="flex min-h-[70vh] items-center justify-center">
    <article class="surface-card max-w-2xl p-8 text-center sm:p-12">
      <p class="text-xs uppercase tracking-[0.32em] text-amber-700">Erro 403</p>
      <h1 class="mt-4 font-display text-5xl text-ink-900">Acesso negado</h1>
      <p class="mt-5 text-sm leading-7 text-ink-700 sm:text-base">
        Esta rota existe, mas o seu perfil atual não tem permissão para acessá-la. O bloqueio
        segue as mesmas regras de autorização impostas pela API.
      </p>
      <a
        href="/"
        class="soft-ring mt-8 inline-flex rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-mint-700"
      >
        Voltar ao painel
      </a>
    </article>
  </section>
</template>
