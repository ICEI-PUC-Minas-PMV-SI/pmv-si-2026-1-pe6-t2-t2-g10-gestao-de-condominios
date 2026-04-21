<template>
  <section class="flex min-h-[70vh] items-center justify-center">
    <article class="surface-card max-w-2xl p-8 text-center sm:p-12">
      <p class="text-xs uppercase tracking-[0.32em] text-brand-700">Erro 404</p>
      <h1 class="mt-4 font-display text-5xl text-ink-900">Não encontramos o que você procurou</h1>
      <p class="mt-5 text-sm leading-7 text-ink-700 sm:text-base">
        A rota não existe ou a API respondeu que o recurso não foi encontrado. Revise o caminho ou
        volte para o mural principal.
      </p>
      <a
        href="/avisos"
        class="soft-ring mt-8 inline-flex rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Ir para avisos
      </a>
    </article>
  </section>
</template>
