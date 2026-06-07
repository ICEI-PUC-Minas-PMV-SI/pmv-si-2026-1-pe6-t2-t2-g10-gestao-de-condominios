<script setup lang="ts">
import { ref } from 'vue'

const areaComum = ref('')
const apartamento = ref('')
const dataHoraInicio = ref('')
const dataHoraFim = ref('')
const observacao = ref('')

function salvarReserva() {
  console.log({
    areaComum: areaComum.value,
    apartamento: apartamento.value,
    dataHoraInicio: dataHoraInicio.value,
    dataHoraFim: dataHoraFim.value,
    observacao: observacao.value,
  })

  alert('Reserva registrada com sucesso!')
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">
        Reserva de Área Comum
      </h1>

      <p class="text-app-secondary mt-2">
        Solicite a reserva de uma área comum do condomínio.
      </p>
    </div>

    <div class="surface-card rounded-3xl border p-6">
      <form
        class="space-y-6"
        @submit.prevent="salvarReserva"
      >
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium">
              Área Comum
            </label>

            <select
              v-model="areaComum"
              class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
            >
              <option value="">Selecione</option>
              <option>Salão de Festas</option>
              <option>Churrasqueira</option>
              <option>Quadra</option>
              <option>Piscina</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium">
              Apartamento
            </label>

            <input
              v-model="apartamento"
              type="text"
              class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
              placeholder="Ex.: 101"
            />
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium">
              Data/Hora Início
            </label>

            <input
              v-model="dataHoraInicio"
              type="datetime-local"
              class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium">
              Data/Hora Fim
            </label>

            <input
              v-model="dataHoraFim"
              type="datetime-local"
              class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
            />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">
            Observação
          </label>

          <textarea
            v-model="observacao"
            rows="5"
            class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
            placeholder="Informações adicionais sobre a reserva..."
          />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            class="theme-secondary-button"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="theme-primary-button"
          >
            Solicitar Reserva
          </button>
        </div>
      </form>
    </div>
  </div>
</template>