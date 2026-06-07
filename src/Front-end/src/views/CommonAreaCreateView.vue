<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  nome: '',
  descricao: '',
  capacidade: null as number | null,
  ativa: true,
  requerAprovacao: false,
})

function salvarAreaComum() {
  console.log(form.value)

  // Aqui será feita a chamada para API futuramente
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
    <section class="surface-card p-6">
      <div class="mb-6">
        <p class="text-xs uppercase tracking-[0.22em] text-app-tertiary">
          Área comum
        </p>

        <h1 class="mt-2 text-3xl font-semibold">
          Cadastro de Área Comum
        </h1>

        <p class="mt-2 text-app-secondary">
          Cadastre espaços compartilhados disponíveis para reserva pelos moradores.
        </p>
      </div>

      <div
        class="rounded-2xl border border-dashed p-10 text-center text-app-secondary"
      >
        Após o cadastro, a área ficará disponível para gerenciamento e reservas.
      </div>
    </section>

    <section class="surface-card p-6">
      <h2 class="mb-6 text-2xl font-semibold">
        Nova Área
      </h2>

      <form
        class="space-y-5"
        @submit.prevent="salvarAreaComum"
      >
        <div>
          <label class="mb-2 block font-medium">
            Nome
          </label>

          <input
            v-model="form.nome"
            type="text"
            placeholder="Ex.: Salão de Festas"
            class="flex items-center gap-3 rounded-xl border p-4 w-full"
          />
        </div>

        <div>
          <label class="mb-2 block font-medium">
            Descrição
          </label>

          <textarea
            v-model="form.descricao"
            rows="4"
            placeholder="Descreva a área comum..."
            class="flex items-center gap-3 rounded-xl border p-4 w-full"
          />
        </div>

        <div>
          <label class="mb-2 block font-medium">
            Capacidade
          </label>

          <input
            v-model="form.capacidade"
            type="number"
            min="1"
            placeholder="Quantidade de pessoas"
            class="flex items-center gap-3 rounded-xl border p-4 w-full"
          />
        </div>

        <label
          class="flex items-center gap-3 rounded-xl border p-4"
        >
          <input
            v-model="form.ativa"
            type="checkbox"
          />

          <span>Área ativa</span>
        </label>

        <label
          class="flex items-center gap-3 rounded-xl border p-4"
        >
          <input
            v-model="form.requerAprovacao"
            type="checkbox"
          />

          <span>Requer aprovação para reserva</span>
        </label>

        <button
          type="submit"
          class="theme-primary-button w-full"
        >
          Cadastrar Área
        </button>
      </form>
    </section>
  </div>
</template>