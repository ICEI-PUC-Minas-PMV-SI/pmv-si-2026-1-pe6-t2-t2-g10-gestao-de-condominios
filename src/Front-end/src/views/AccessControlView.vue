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
  <section class="space-y-6">
    <div class="space-y-2">
      <h2 class="font-display text-3xl text-ink-950">Controle de Portaria</h2>
    </div>

    <!-- IMAGEM BLOCO SUPERIOR: Cadastrar Novo Acesso -->
    <section class="surface-card p-6 space-y-4">
      <h3 class="font-display text-2xl text-ink-950">Registrar Entrada</h3>

      <div class="flex gap-3">
        <input
          v-model="cpfBusca"
          placeholder="CPF do visitante (só números)"
          maxlength="11"
          class="theme-control flex-1 outline-none"
        />
        <button
          @click="buscarVisitante"
          :disabled="buscando"
          class="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-bold text-sm disabled:opacity-50"
        >
          {{ buscando ? '...' : 'Buscar' }}
        </button>
      </div>

      <!-- Detalhes do visitante após busca -->
      <div v-if="visitanteEncontrado" class="mt-4 p-5 bg-slate-500/10 border border-slate-200/50 rounded-xl space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-md font-bold text-blue-600">{{ visitanteEncontrado.nome }}</h4>
            <p class="text-xs text-ink-700">CPF: {{ visitanteEncontrado.cpf.value }}</p>
          </div>
          <span 
            :class="visitanteEncontrado.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
            class="px-2.5 py-1 rounded-full text-xs font-bold"
          >
            {{ visitanteEncontrado.ativo ? 'ATIVO' : 'INATIVO' }}
          </span>
        </div>

        <!-- Caso esteja INATIVO -->
        <div v-if="!visitanteEncontrado.ativo" class="space-y-3">
          <div class="bg-red-500/10 text-red-700 p-3 rounded-lg font-bold text-sm border border-red-500/20">
            ⚠️ Visitante INATIVO — entrada não permitida.
          </div>
          <button
            @click="reativarVisitante"
            :disabled="reativando"
            class="bg-amber-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-amber-600 transition disabled:opacity-50"
          >
            {{ reativando ? 'Reativando...' : 'Reativar Visitante' }}
          </button>
        </div>

        <!-- Caso esteja ATIVO -->
        <div v-else class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Motivo da Visita</label>
              <select v-model="dadosEntrada.motivoVisita" class="theme-control w-full">
                <option :value="1">Social / Visita</option>
                <option :value="2">Prestação de Serviço</option>
                <option :value="3">Entrega / Delivery</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Tipo de Acesso</label>
              <select v-model="dadosEntrada.tipoAcesso" class="theme-control w-full">
                <option :value="1">Entrada Normal</option>
                <option :value="2">Entrada Autorizada</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Observações (opcional)</label>
            <textarea
              v-model="dadosEntrada.observacao"
              placeholder="Descreva observações importantes sobre o acesso..."
              class="theme-control w-full resize-none h-20 outline-none"
            ></textarea>
          </div>

          <button
            @click="registrarEntrada"
            :disabled="registrando"
            class="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50"
          >
            {{ registrando ? 'Registrando...' : 'CONFIRMAR ENTRADA' }}
          </button>
        </div>
      </div>
    </section>

    <hr class="border-t border-slate-300 my-8" />

    <!-- BLOCO INFERIOR: Visitantes no Condomínio -->
    <section class="surface-card p-6 space-y-4">
      <div class="flex justify-between items-center">
        <h3 class="font-display text-2xl text-ink-950">Visitantes no Condomínio</h3>
        <button 
          @click="carregarAbertos" 
          :disabled="carregando"
          class="text-blue-600 hover:underline flex items-center gap-1 font-semibold text-sm disabled:opacity-50 font-bold"
        >
          {{ carregando ? 'Atualizando...' : 'Atualizar' }}
        </button>
      </div>

      <div v-if="carregando" class="text-ink-700 text-sm py-4">Atualizando lista...</div>
      <div v-else-if="acessosAbertos.length === 0" class="text-ink-700 py-6 text-center border border-dashed border-slate-300 rounded-xl text-sm">
        Ninguém no condomínio no momento.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="acesso in acessosAbertos"
          :key="acesso.id"
          class="flex justify-between items-center p-4 bg-slate-500/5 border border-slate-200/50 rounded-xl"
        >
          <div>
            <p class="font-bold text-ink-950">{{ acesso.visitante?.nome ?? 'Visitante' }}</p>
            <p class="text-xs text-ink-700">
              Entrou às: {{ new Date(acesso.dataHoraEntrada).toLocaleTimeString('pt-BR') }}
            </p>
          </div>
          <button
            v-if="acesso.visitante"
            @click="registrarSaida(acesso.visitante.cpf.value)"
            class="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-200 transition"
          >
            SAÍDA
          </button>
        </div>
      </div>
    </section>
  </section>
</template>