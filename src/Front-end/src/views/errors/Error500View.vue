<template>
  <section class="flex min-h-[70vh] items-center justify-center">
    <article class="surface-card max-w-2xl p-8 text-center sm:p-12">
      <p class="text-xs uppercase tracking-[0.32em] text-red-700">Erro 500</p>
      <h1 class="mt-4 font-display text-5xl text-ink-900">A API encontrou uma falha interna</h1>
      <p class="mt-5 text-sm leading-7 text-ink-700 sm:text-base">
        O servidor não conseguiu concluir a requisição. Aguarde um instante e tente novamente a partir do painel.
      </p>
      <a
        href="/"
        class="soft-ring mt-8 inline-flex rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Reabrir painel
      </a>
    </article>
  </section>
</template>
