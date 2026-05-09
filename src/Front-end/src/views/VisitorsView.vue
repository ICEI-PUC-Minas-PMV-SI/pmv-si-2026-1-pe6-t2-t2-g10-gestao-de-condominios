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

// Formulário de cadastro
const mostrarFormulario = ref(false);
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
  try {
    const [resVisitantes, resApartamentos] = await Promise.all([
      visitorService.getAll(),
      apartmentService.getAll(),
    ]);
    visitantes.value = Array.isArray(resVisitantes) ? resVisitantes : (resVisitantes.data ?? []);
    apartamentos.value = Array.isArray(resApartamentos) ? resApartamentos : (resApartamentos.data ?? []);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    alert('Erro ao conectar com o servidor.');
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
  try {
    await visitorService.create({
      ...novoVisitante.value,
      cpf: novoVisitante.value.cpf.replace(/\D/g, ''),
    });
    alert('Visitante cadastrado com sucesso!');
    mostrarFormulario.value = false;
    novoVisitante.value = { nome: '', cpf: '', telefone: '', observacao: '', idApartamento: 0 };
    await carregarDados();
  } catch (error) {
    console.error('Erro ao cadastrar visitante:', error);
    alert('Erro ao cadastrar visitante. Verifique os dados.');
  } finally {
    salvando.value = false;
  }
};

const abrirEdicao = (v: VisitanteResponse) => {
  visitanteEditando.value = v;
  dadosEdicao.value = {
    nome: v.nome,
    telefone: v.telefone,
    observacao: v.observacao,
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
  try {
    await visitorService.update(visitanteEditando.value.cpf.value, dadosEdicao.value);
    alert('Visitante atualizado com sucesso!');
    fecharEdicao();
    await carregarDados();
  } catch {
    alert('Erro ao atualizar visitante.');
  } finally {
    salvandoEdicao.value = false;
  }
};

const desativarVisitante = async (cpf: string) => {
  if (!confirm('Deseja realmente desativar este visitante?')) return;
  try {
    await visitorService.desativar(cpf);
    await carregarDados();
  } catch {
    alert('Erro ao desativar visitante.');
  }
};

const reativarVisitante = async (cpf: string) => {
  if (!confirm('Deseja reativar este visitante?')) return;
  try {
    await visitorService.reativar(cpf);
    await carregarDados();
  } catch {
    alert('Erro ao reativar visitante.');
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
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Gestão de Visitantes</h1>
      <button
        @click="mostrarFormulario = !mostrarFormulario"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {{ mostrarFormulario ? 'Cancelar' : 'Novo Visitante' }}
      </button>
    </div>

    <!-- Formulário de Cadastro -->
    <div v-if="mostrarFormulario" class="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 shadow-sm">
      <h2 class="text-lg font-semibold mb-4">Cadastrar Novo Visitante</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="novoVisitante.nome" placeholder="Nome Completo" class="p-2 border rounded" />
        <input v-model="novoVisitante.cpf" placeholder="CPF (apenas números)" maxlength="11" class="p-2 border rounded" />
        <input v-model="novoVisitante.telefone" placeholder="Telefone" class="p-2 border rounded" />
        <select v-model="novoVisitante.idApartamento" class="p-2 border rounded">
          <option :value="0" disabled>Selecione o Apartamento</option>
          <option v-for="ap in apartamentos" :key="ap.id" :value="ap.id">
            Ap: {{ ap.numero }} - Bloco: {{ ap.bloco }}
          </option>
        </select>
        <textarea
          v-model="novoVisitante.observacao"
          placeholder="Observações"
          class="p-2 border rounded md:col-span-2"
        ></textarea>
      </div>
      <button
        @click="salvarVisitante"
        :disabled="salvando"
        class="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {{ salvando ? 'Salvando...' : 'Salvar Cadastro' }}
      </button>
    </div>

    <!-- Barra de Busca -->
    <div class="mb-4">
      <input
        v-model="buscaCpf"
        type="text"
        placeholder="🔍 Buscar por CPF..."
        class="w-full md:w-1/3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Tabela -->
    <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-100 text-gray-700 uppercase text-sm">
          <tr>
            <th class="p-4 border-b">Nome</th>
            <th class="p-4 border-b">CPF</th>
            <th class="p-4 border-b">Telefone</th>
            <th class="p-4 border-b">Status</th>
            <th class="p-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="carregando">
            <td colspan="5" class="p-4 text-center text-blue-500">Carregando dados...</td>
          </tr>
          <tr v-else-if="visitantesFiltrados.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-500">Nenhum visitante encontrado.</td>
          </tr>
          <tr
            v-for="v in visitantesFiltrados"
            :key="v.id"
            class="hover:bg-gray-50 transition border-b"
          >
            <td class="p-4 font-medium">
              <button
                @click="verAcessos(v)"
                class="text-blue-700 hover:underline font-medium text-left"
              >
                {{ v.nome }}
              </button>
            </td>
            <td class="p-4 text-gray-600">{{ v.cpf?.value }}</td>
            <td class="p-4 text-gray-600">{{ v.telefone }}</td>
            <td class="p-4">
              <span
                :class="v.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-2 py-1 rounded-full text-xs font-bold"
              >
                {{ v.ativo ? 'ATIVO' : 'INATIVO' }}
              </span>
            </td>
            <td class="p-4">
              <div class="flex gap-3">
                <button
                  @click="abrirEdicao(v)"
                  class="text-blue-600 hover:underline text-sm"
                >
                  Editar
                </button>
                <button
                  v-if="v.ativo"
                  @click="desativarVisitante(v.cpf.value)"
                  class="text-red-600 hover:underline text-sm"
                >
                  Desativar
                </button>
                <button
                  v-else
                  @click="reativarVisitante(v.cpf.value)"
                  class="text-green-600 hover:underline text-sm"
                >
                  Reativar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Edição -->
    <div
      v-if="visitanteEditando"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-lg font-bold">Editar Visitante</h2>
          <button @click="fecharEdicao" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
        </div>
        <div class="p-6 grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nome</label>
            <input v-model="dadosEdicao.nome" class="w-full p-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Telefone</label>
            <input v-model="dadosEdicao.telefone" class="w-full p-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Apartamento</label>
            <select v-model="dadosEdicao.idApartamento" class="w-full p-2 border rounded">
              <option :value="0" disabled>Selecione o Apartamento</option>
              <option v-for="ap in apartamentos" :key="ap.id" :value="ap.id">
                Ap: {{ ap.numero }} - Bloco: {{ ap.bloco }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Observações</label>
            <textarea v-model="dadosEdicao.observacao" class="w-full p-2 border rounded" rows="3"></textarea>
          </div>
        </div>
        <div class="p-4 border-t flex justify-end gap-3">
          <button @click="fecharEdicao" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
            Cancelar
          </button>
          <button
            @click="salvarEdicao"
            :disabled="salvandoEdicao"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {{ salvandoEdicao ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Histórico de Acessos -->
    <div
      v-if="visitanteSelecionado"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div class="flex justify-between items-center p-6 border-b">
          <div>
            <h2 class="text-lg font-bold">Histórico de Acessos</h2>
            <p class="text-sm text-gray-500">{{ visitanteSelecionado.nome }} — {{ visitanteSelecionado.cpf.value }}</p>
          </div>
          <button @click="fecharModal" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
        </div>
        <div class="overflow-y-auto flex-1 p-6">
          <div v-if="carregandoAcessos" class="text-center text-blue-500">Carregando acessos...</div>
          <div v-else-if="acessosVisitante.length === 0" class="text-center text-gray-500 italic">
            Nenhum acesso registrado para este visitante.
          </div>
          <table v-else class="w-full text-sm border-collapse">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th class="p-3 border-b text-left">Entrada</th>
                <th class="p-3 border-b text-left">Saída</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="acesso in acessosVisitante"
                :key="acesso.id"
                class="border-b hover:bg-gray-50"
              >
                <td class="p-3">{{ formatarData(acesso.dataHoraEntrada) }}</td>
                <td class="p-3">
                  <span v-if="acesso.dataHoraSaida">{{ formatarData(acesso.dataHoraSaida) }}</span>
                  <span v-else class="text-yellow-600 font-bold">Em aberto</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-4 border-t text-right">
          <button @click="fecharModal" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>