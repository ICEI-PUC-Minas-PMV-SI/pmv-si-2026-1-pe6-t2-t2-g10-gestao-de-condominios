<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { visitorService } from '@/services/visitor.service';
import { apartmentService } from '@/services/apartment.service';
import { accessService } from '@/services/access.service';
import type { VisitanteResponse, ApartamentoResponse, AcessoVisitanteResponse } from '@/types/api';

// --- ESTADO ---
const visitantes = ref<VisitanteResponse[]>([]);
const apartamentos = ref<ApartamentoResponse[]>([]);
const carregando = ref(true);
const buscaCpf = ref('');
const errorMessage = ref('');

// Formulário de cadastro
const salvando = ref(false);
const novoVisitante = ref({
  nome: '',
  cpf: '',
  telefone: '',
  observacao: '',
  idApartamento: 0,
});

// Formulário de edição
const visitanteEditando = ref<VisitanteResponse | null>(null);
const dadosEdicao = ref({
  nome: '',
  telefone: '',
  observacao: '',
  idApartamento: 0,
});
const salvandoEdicao = ref(false);

// Modal de acessos
const visitanteSelecionado = ref<VisitanteResponse | null>(null);
const acessosVisitante = ref<AcessoVisitanteResponse[]>([]);
const carregandoAcessos = ref(false);

// --- FUNÇÕES ---
const carregarDados = async () => {
  carregando.value = true;
  errorMessage.value = '';
  try {
    const [resVisitantes, resApartamentos] = await Promise.all([
      visitorService.getAll(),
      apartmentService.getAll(),
    ]);
    visitantes.value = Array.isArray(resVisitantes) ? resVisitantes : (resVisitantes.data ?? []);
    apartamentos.value = Array.isArray(resApartamentos) ? resApartamentos : (resApartamentos.data ?? []);
  } catch {
    errorMessage.value = 'Erro ao conectar com o servidor e carregar dados.';
  } finally {
    carregando.value = false;
  }
};

const visitantesFiltrados = computed(() => {
  if (!buscaCpf.value) return visitantes.value;
  return visitantes.value.filter(v =>
    v.cpf?.value?.includes(buscaCpf.value.replace(/\D/g, ''))
  );
});

const salvarVisitante = async () => {
  if (!novoVisitante.value.nome || !novoVisitante.value.cpf) {
    alert('Nome e CPF são obrigatórios.');
    return;
  }
  if (novoVisitante.value.idApartamento === 0) {
    alert('Selecione um apartamento.');
    return;
  }
  salvando.value = true;
  errorMessage.value = '';
  try {
    await visitorService.create({
      ...novoVisitante.value,
      cpf: novoVisitante.value.cpf.replace(/\D/g, ''),
    });
      alert('Visitante cadastrado com sucesso!');
    novoVisitante.value = { nome: '', cpf: '', telefone: '', observacao: '', idApartamento: 0 };
    await carregarDados();
  } catch {
    errorMessage.value = 'Erro ao cadastrar visitante. Verifique os dados.';
  } finally {
    salvando.value = false;
  }
};

const abrirEdicao = (v: VisitanteResponse) => {
  visitanteEditando.value = v;
  dadosEdicao.value = {
    nome: v.nome,
    telefone: v.telefone ?? '',
    observacao: v.observacao ?? '',
    idApartamento: v.idApartamento,
  };
};

const fecharEdicao = () => {
  visitanteEditando.value = null;
};

const salvarEdicao = async () => {
  if (!visitanteEditando.value) return;
  if (!dadosEdicao.value.nome) {
    alert('Nome é obrigatório.');
    return;
  }
  salvandoEdicao.value = true;
  errorMessage.value = '';
  try {
    await visitorService.update(visitanteEditando.value.cpf.value, dadosEdicao.value);
    alert('Visitante atualizado com sucesso!');
    fecharEdicao();
    await carregarDados();
  } catch {
    errorMessage.value = 'Erro ao atualizar visitante.';
  } finally {
    salvandoEdicao.value = false;
  }
};

const desativarVisitante = async (cpf: string) => {
  if (!confirm('Deseja realmente desativar este visitante?')) return;
  errorMessage.value = '';
  try {
    await visitorService.desativar(cpf);
    await carregarDados();
  } catch {
    errorMessage.value = 'Erro ao desativar visitante.';
  }
};

const reativarVisitante = async (cpf: string) => {
  if (!confirm('Deseja reativar este visitante?')) return;
  errorMessage.value = '';
  try {
    await visitorService.reativar(cpf);
    await carregarDados();
  } catch {
    errorMessage.value = 'Erro ao reativar visitante.';
  }
};

const verAcessos = async (v: VisitanteResponse) => {
  visitanteSelecionado.value = v;
  acessosVisitante.value = [];
  carregandoAcessos.value = true;
  try {
    const res = await accessService.getAcessosPorCpf(v.cpf.value);
    acessosVisitante.value = Array.isArray(res) ? res : (res.data ?? []);
  } catch {
    alert('Erro ao carregar histórico de acessos.');
  } finally {
    carregandoAcessos.value = false;
  }
};

const fecharModal = () => {
  visitanteSelecionado.value = null;
  acessosVisitante.value = [];
};

const formatarData = (data: string) =>
  new Date(data).toLocaleString('pt-BR');

onMounted(carregarDados);
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-2">
      <h2 class="font-display text-3xl text-ink-950">Gestão de Visitantes</h2>
    </div>

    <!-- Alertas de Erro -->
    <div v-if="errorMessage" class="surface-card border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      
      <!-- Listagem de Visitantes -->
      <section class="surface-card p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 class="font-display text-2xl text-ink-950">Visitantes Cadastrados</h3>
          
          <input
            v-model="buscaCpf"
            type="text"
            placeholder="🔍 Buscar por CPF..."
            class="theme-control w-full sm:w-64"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-ink-700">
                <th class="pb-3 font-semibold">Nome</th>
                <th class="pb-3 font-semibold">CPF</th>
                <th class="pb-3 font-semibold">Telefone</th>
                <th class="pb-3 font-semibold">Status</th>
                <th class="pb-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="carregando">
                <td colspan="5" class="py-4 text-center text-ink-700">Carregando dados...</td>
              </tr>
              <tr v-else-if="visitantesFiltrados.length === 0">
                <td colspan="5" class="py-6 text-center text-ink-700 rounded-xl border border-dashed border-slate-300">
                  Nenhum visitante localizado neste momento.
                </td>
              </tr>
              <tr
                v-for="v in visitantesFiltrados"
                :key="v.id"
                v-else
                class="hover:bg-slate-500/5 transition border-b border-slate-100"
              >
                <td class="py-4 font-semibold text-ink-950">
                  <button
                    @click="verAcessos(v)"
                    class="text-blue-600 hover:underline text-left font-semibold"
                  >
                    {{ v.nome }}
                  </button>
                </td>
                <td class="py-4 text-ink-700">{{ v.cpf?.value }}</td>
                <td class="py-4 text-ink-700">{{ v.telefone || '—' }}</td>
                <td class="py-4">
                  <span
                    :class="v.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    class="px-2.5 py-1 rounded-full text-xs font-bold"
                  >
                    {{ v.ativo ? 'ATIVO' : 'INATIVO' }}
                  </span>
                </td>
                <td class="py-4 text-right">
                  <div class="flex gap-3 justify-end">
                    <button
                      @click="abrirEdicao(v)"
                      class="text-blue-600 hover:underline font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      v-if="v.ativo"
                      @click="desativarVisitante(v.cpf.value)"
                      class="text-red-600 hover:underline font-semibold"
                    >
                      Desativar
                    </button>
                    <button
                      v-else
                      @click="reativarVisitante(v.cpf.value)"
                      class="text-green-600 hover:underline font-semibold"
                    >
                      Reativar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Formulário de Cadastro -->
      <aside class="surface-card p-6">
        <h3 class="font-display text-2xl text-ink-950 mb-6">Novo Visitante</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Nome Completo</label>
            <input v-model="novoVisitante.nome" placeholder="Nome do visitante" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">CPF</label>
            <input v-model="novoVisitante.cpf" placeholder="CPF (apenas números)" maxlength="11" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Telefone</label>
            <input v-model="novoVisitante.telefone" placeholder="Telefone" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Apartamento</label>
            <select v-model="novoVisitante.idApartamento" class="theme-control w-full">
              <option :value="0" disabled>Selecione uma unidade</option>
              <option v-for="ap in apartamentos" :key="ap.id" :value="ap.id">
                Ap: {{ ap.numero }} - Bloco: {{ ap.bloco }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Observações</label>
            <textarea v-model="novoVisitante.observacao" placeholder="Ex: Prestador de serviço..." class="theme-control w-full resize-none h-20 outline-none"></textarea>
          </div>

          <button
            @click="salvarVisitante"
            :disabled="salvando"
            class="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mt-2"
          >
            {{ salvando ? 'Salvando...' : 'Salvar Cadastro' }}
          </button>
        </div>
      </aside>
    </div>

    <!-- Modal de Edição -->
    <div v-if="visitanteEditando" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="surface-card rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden border border-slate-200/50">
        <div class="flex justify-between items-center p-6 border-b border-slate-200/50">
          <h2 class="font-display text-2xl text-ink-950">Editar Visitante</h2>
          <button @click="fecharEdicao" class="text-ink-700 hover:text-ink-950 text-2xl font-bold">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Nome</label>
            <input v-model="dadosEdicao.nome" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Telefone</label>
            <input v-model="dadosEdicao.telefone" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Apartamento</label>
            <select v-model="dadosEdicao.idApartamento" class="theme-control w-full">
              <option :value="0" disabled>Selecione uma unidade</option>
              <option v-for="ap in apartamentos" :key="ap.id" :value="ap.id">
                Ap: {{ ap.numero }} - Bloco: {{ ap.bloco }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Observações</label>
            <textarea v-model="dadosEdicao.observacao" class="theme-control w-full resize-none h-20 outline-none"></textarea>
          </div>
        </div>
        <div class="p-4 border-t border-slate-200/50 flex justify-end gap-3">
          <button @click="fecharEdicao" class="border border-slate-200/80 text-ink-700 px-4 py-2 rounded-lg hover:bg-slate-500/10 transition font-semibold">
            Cancelar
          </button>
          <button
            @click="salvarEdicao"
            :disabled="salvandoEdicao"
            class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-bold"
          >
            {{ salvandoEdicao ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Histórico de Acessos -->
    <div v-if="visitanteSelecionado" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="surface-card rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col overflow-hidden border border-slate-200/50">
        <div class="flex justify-between items-center p-6 border-b border-slate-200/50">
          <div>
            <h2 class="font-display text-2xl text-ink-950">Histórico de Acessos</h2>
            <p class="text-sm text-ink-700">{{ visitanteSelecionado.nome }} — {{ visitanteSelecionado.cpf.value }}</p>
          </div>
          <button @click="fecharModal" class="text-ink-700 hover:text-ink-950 text-2xl font-bold">×</button>
        </div>
        <div class="overflow-y-auto flex-1 p-6">
          <div v-if="carregandoAcessos" class="text-center text-ink-700">Carregando acessos...</div>
          <div v-else-if="acessosVisitante.length === 0" class="text-center text-ink-700 italic">
            Nenhum acesso registrado para este visitante.
          </div>
          <table v-else class="w-full text-sm border-collapse">
            <thead>
              <tr class="text-ink-700 uppercase text-xs border-b border-slate-200/50">
                <th class="p-3 font-semibold text-left">Entrada</th>
                <th class="p-3 font-semibold text-left">Saída</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="acesso in acessosVisitante"
                :key="acesso.id"
                class="border-b border-slate-100 hover:bg-slate-500/5"
              >
                <td class="p-3 text-ink-950 font-medium">{{ formatarData(acesso.dataHoraEntrada) }}</td>
                <td class="p-3">
                  <span v-if="acesso.dataHoraSaida" class="text-ink-700">{{ formatarData(acesso.dataHoraSaida) }}</span>
                  <span v-else class="text-amber-600 font-bold">Em aberto</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-4 border-t border-slate-200/50 text-right">
          <button @click="fecharModal" class="border border-slate-200/80 text-ink-700 px-5 py-2 rounded-lg hover:bg-slate-500/10 transition font-semibold">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </section>
</template>