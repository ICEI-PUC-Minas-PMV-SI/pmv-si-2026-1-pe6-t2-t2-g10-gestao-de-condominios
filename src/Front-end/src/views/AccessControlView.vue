<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { accessService } from '@/services/access.service';
import { visitorService } from '@/services/visitor.service';
import { useAuthStore } from '@/stores/auth';
import type { AcessoVisitanteResponse, VisitanteResponse } from '@/types/api';

const auth = useAuthStore();

const acessosAbertos = ref<AcessoVisitanteResponse[]>([]);
const carregando = ref(false);
const cpfBusca = ref('');
const visitanteEncontrado = ref<VisitanteResponse | null>(null);
const buscando = ref(false);
const registrando = ref(false);
const reativando = ref(false);

const dadosEntrada = ref({
  motivoVisita: 1,
  observacao: '',
  idUsuarioPorteiro: auth.usuario?.id ?? 0,
  idUsuarioApartamento: 0,
  tipoAcesso: 1,
});

const carregarAbertos = async () => {
  carregando.value = true;
  try {
    const res = await accessService.getOpen();
    acessosAbertos.value = res ?? [];
  } catch {
    alert('Erro ao carregar acessos em aberto.');
  } finally {
    carregando.value = false;
  }
};

const buscarVisitante = async () => {
  const cpfLimpo = cpfBusca.value.replace(/\D/g, '');
  if (cpfLimpo.length < 11) {
    alert('Digite um CPF válido com 11 dígitos.');
    return;
  }

  buscando.value = true;
  visitanteEncontrado.value = null;
  try {
    const res = await visitorService.getByCpf(cpfLimpo);
    visitanteEncontrado.value = res;
  } catch {
    alert('Visitante não encontrado.');
  } finally {
    buscando.value = false;
  }
};

const registrarEntrada = async () => {
  if (!visitanteEncontrado.value) return;

  registrando.value = true;
  try {
    await accessService.registerEntry(visitanteEncontrado.value.cpf.value, {
      ...dadosEntrada.value,
      idUsuarioPorteiro: auth.usuario?.id ?? 0,
    });
    alert('Entrada registrada com sucesso!');
    visitanteEncontrado.value = null;
    cpfBusca.value = '';
    dadosEntrada.value = {
      motivoVisita: 1,
      observacao: '',
      idUsuarioPorteiro: auth.usuario?.id ?? 0,
      idUsuarioApartamento: 0,
      tipoAcesso: 1,
    };
    await carregarAbertos();
  } catch {
    alert('Erro ao registrar entrada. Verifique se já existe um acesso em aberto.');
  } finally {
    registrando.value = false;
  }
};

const reativarVisitante = async () => {
  if (!visitanteEncontrado.value) return;
  if (!confirm('Deseja reativar este visitante?')) return;

  reativando.value = true;
  try {
    await visitorService.reativar(visitanteEncontrado.value.cpf.value);
    alert('Visitante reativado com sucesso!');
    // Recarrega os dados do visitante para atualizar o status
    const res = await visitorService.getByCpf(visitanteEncontrado.value.cpf.value);
    visitanteEncontrado.value = res;
  } catch {
    alert('Erro ao reativar visitante.');
  } finally {
    reativando.value = false;
  }
};

const registrarSaida = async (cpf: string) => {
  try {
    await accessService.registerExit(cpf);
    alert('Saída registrada!');
    await carregarAbertos();
  } catch {
    alert('Erro ao registrar saída.');
  }
};

onMounted(carregarAbertos);
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Controle de Portaria</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- LADO ESQUERDO: Registrar Nova Entrada -->
      <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 class="text-lg font-semibold mb-4">Registrar Entrada</h2>

        <div class="flex gap-2 mb-4">
          <input
            v-model="cpfBusca"
            placeholder="CPF do visitante (só números)"
            maxlength="11"
            class="flex-1 p-2 border rounded"
          />
          <button
            @click="buscarVisitante"
            :disabled="buscando"
            class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {{ buscando ? '...' : 'Buscar' }}
          </button>
        </div>

        <div v-if="visitanteEncontrado" class="bg-blue-50 p-4 rounded border border-blue-100">
          <p class="font-bold text-blue-800">{{ visitanteEncontrado.nome }}</p>
          <p class="text-sm text-blue-600 mb-3">CPF: {{ visitanteEncontrado.cpf.value }}</p>

          <!-- VISITANTE INATIVO -->
          <template v-if="!visitanteEncontrado.ativo">
            <div class="bg-red-100 text-red-700 p-3 rounded mb-4 font-bold">
              ⚠️ Visitante INATIVO — entrada não permitida.
            </div>
            <button
              @click="reativarVisitante"
              :disabled="reativando"
              class="w-full bg-yellow-500 text-white py-2 rounded font-bold hover:bg-yellow-600 disabled:opacity-50"
            >
              {{ reativando ? 'Reativando...' : 'Reativar Visitante' }}
            </button>
          </template>

          <!-- VISITANTE ATIVO: exibe formulário normalmente -->
          <template v-else>
            <label class="block text-sm font-medium mb-1">Motivo da Visita:</label>
            <select v-model="dadosEntrada.motivoVisita" class="w-full p-2 border rounded mb-3">
              <option :value="1">Social / Visita</option>
              <option :value="2">Prestação de Serviço</option>
              <option :value="3">Entrega / Delivery</option>
            </select>

            <label class="block text-sm font-medium mb-1">Tipo de Acesso:</label>
            <select v-model="dadosEntrada.tipoAcesso" class="w-full p-2 border rounded mb-3">
              <option :value="1">Entrada Normal</option>
              <option :value="2">Entrada Autorizada</option>
            </select>

            <textarea
              v-model="dadosEntrada.observacao"
              placeholder="Observações (opcional)"
              class="w-full p-2 border rounded mb-4"
            ></textarea>

            <button
              @click="registrarEntrada"
              :disabled="registrando"
              class="w-full bg-green-600 text-white py-2 rounded font-bold disabled:opacity-50"
            >
              {{ registrando ? 'Registrando...' : 'CONFIRMAR ENTRADA' }}
            </button>
          </template>
        </div>
      </div>

      <!-- LADO DIREITO: Visitantes no Prédio -->
      <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Visitantes no Condomínio</h2>
          <button @click="carregarAbertos" class="text-sm text-blue-600 hover:underline">
            Atualizar
          </button>
        </div>

        <div v-if="carregando" class="text-blue-500 text-sm">Atualizando lista...</div>
        <div v-else-if="acessosAbertos.length === 0" class="text-gray-500 italic text-sm">
          Ninguém no condomínio no momento.
        </div>

        <div
          v-for="acesso in acessosAbertos"
          :key="acesso.id"
          class="flex justify-between items-center p-3 border-b last:border-0"
        >
          <div>
            <p class="font-medium">{{ acesso.visitante?.nome ?? 'Visitante' }}</p>
            <p class="text-xs text-gray-500">
              Entrou às: {{ new Date(acesso.dataHoraEntrada).toLocaleTimeString('pt-BR') }}
            </p>
          </div>
          <button
            v-if="acesso.visitante"
            @click="registrarSaida(acesso.visitante.cpf.value)"
            class="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold hover:bg-red-200"
          >
            SAÍDA
          </button>
        </div>
      </div>
    </div>
  </div>
</template>