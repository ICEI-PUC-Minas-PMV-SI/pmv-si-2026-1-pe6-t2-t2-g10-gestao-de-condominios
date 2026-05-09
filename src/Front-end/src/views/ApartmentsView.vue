<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apartmentService } from '@/services/apartment.service';
import type { ApartamentoResponse } from '@/types/api';

const apartamentos = ref<ApartamentoResponse[]>([]);
const carregando = ref(true);
const mostrarFormulario = ref(false);
const salvando = ref(false);

const novoApartamento = ref({
  numero: '',
  bloco: '',
  andar: 1,
  tipo: '',
});

// Edição
const apartamentoEditando = ref<ApartamentoResponse | null>(null);
const dadosEdicao = ref({
  numero: '',
  bloco: '',
  andar: 1,
  tipo: '',
});
const salvandoEdicao = ref(false);

const carregar = async () => {
  carregando.value = true;
  try {
    const res = await apartmentService.getAll();
    apartamentos.value = Array.isArray(res) ? res : (res.data ?? []);
  } catch {
    alert('Erro ao carregar apartamentos.');
  } finally {
    carregando.value = false;
  }
};

const salvarApartamento = async () => {
  if (!novoApartamento.value.numero || !novoApartamento.value.bloco || !novoApartamento.value.tipo) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }
  salvando.value = true;
  try {
    await apartmentService.create(novoApartamento.value);
    alert('Apartamento cadastrado com sucesso!');
    mostrarFormulario.value = false;
    novoApartamento.value = { numero: '', bloco: '', andar: 1, tipo: '' };
    await carregar();
  } catch {
    alert('Erro ao cadastrar apartamento.');
  } finally {
    salvando.value = false;
  }
};

const abrirEdicao = (ap: ApartamentoResponse) => {
  apartamentoEditando.value = ap;
  dadosEdicao.value = {
    numero: ap.numero,
    bloco: ap.bloco,
    andar: ap.andar,
    tipo: ap.tipo,
  };
};

const fecharEdicao = () => {
  apartamentoEditando.value = null;
};

const salvarEdicao = async () => {
  if (!apartamentoEditando.value) return;
  if (!dadosEdicao.value.numero || !dadosEdicao.value.bloco || !dadosEdicao.value.tipo) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }
  salvandoEdicao.value = true;
  try {
    await apartmentService.update(apartamentoEditando.value.id, dadosEdicao.value);
    alert('Apartamento atualizado com sucesso!');
    fecharEdicao();
    await carregar();
  } catch {
    alert('Erro ao atualizar apartamento.');
  } finally {
    salvandoEdicao.value = false;
  }
};

const inativar = async (id: number) => {
  if (!confirm('Deseja realmente inativar este apartamento?')) return;
  try {
    await apartmentService.desativar(id);
    await carregar();
  } catch {
    alert('Erro ao inativar apartamento.');
  }
};

const reativar = async (id: number) => {
  if (!confirm('Deseja reativar este apartamento?')) return;
  try {
    await apartmentService.reativar(id);
    await carregar();
  } catch {
    alert('Erro ao reativar apartamento.');
  }
};

onMounted(carregar);
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Gestão de Apartamentos</h1>
      <button
        @click="mostrarFormulario = !mostrarFormulario"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {{ mostrarFormulario ? 'Cancelar' : 'Novo Apartamento' }}
      </button>
    </div>

    <!-- Formulário de Cadastro -->
    <div v-if="mostrarFormulario" class="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200 shadow-sm">
      <h2 class="text-lg font-semibold mb-4">Cadastrar Novo Apartamento</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="novoApartamento.numero" placeholder="Número (ex: 101)" class="p-2 border rounded" />
        <input v-model="novoApartamento.bloco" placeholder="Bloco (ex: A)" class="p-2 border rounded" />
        <input v-model.number="novoApartamento.andar" type="number" min="1" placeholder="Andar" class="p-2 border rounded" />
        <input v-model="novoApartamento.tipo" placeholder="Tipo (ex: 2 quartos)" class="p-2 border rounded" />
      </div>
      <button
        @click="salvarApartamento"
        :disabled="salvando"
        class="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {{ salvando ? 'Salvando...' : 'Salvar' }}
      </button>
    </div>

    <!-- Tabela -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50">
          <tr>
            <th class="p-4 border-b">Número</th>
            <th class="p-4 border-b">Bloco</th>
            <th class="p-4 border-b">Andar</th>
            <th class="p-4 border-b">Tipo</th>
            <th class="p-4 border-b">Status</th>
            <th class="p-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="carregando">
            <td colspan="6" class="p-4 text-center text-blue-500">Carregando...</td>
          </tr>
          <tr v-else-if="apartamentos.length === 0">
            <td colspan="6" class="p-4 text-center text-gray-500">Nenhum apartamento cadastrado.</td>
          </tr>
          <tr v-for="ap in apartamentos" :key="ap.id" class="border-b hover:bg-gray-50">
            <td class="p-4">{{ ap.numero }}</td>
            <td class="p-4">{{ ap.bloco }}</td>
            <td class="p-4">{{ ap.andar }}º</td>
            <td class="p-4">{{ ap.tipo }}</td>
            <td class="p-4">
              <span
                :class="ap.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-2 py-1 rounded-full text-xs font-bold"
              >
                {{ ap.ativo ? 'ATIVO' : 'INATIVO' }}
              </span>
            </td>
            <td class="p-4">
              <div class="flex gap-3">
                <button @click="abrirEdicao(ap)" class="text-blue-600 hover:underline text-sm">
                  Editar
                </button>
                <button v-if="ap.ativo" @click="inativar(ap.id)" class="text-red-600 hover:underline text-sm">
                  Inativar
                </button>
                <button v-else @click="reativar(ap.id)" class="text-green-600 hover:underline text-sm">
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
      v-if="apartamentoEditando"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-lg font-bold">Editar Apartamento</h2>
          <button @click="fecharEdicao" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Número</label>
            <input v-model="dadosEdicao.numero" class="w-full p-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Bloco</label>
            <input v-model="dadosEdicao.bloco" class="w-full p-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Andar</label>
            <input v-model.number="dadosEdicao.andar" type="number" min="1" class="w-full p-2 border rounded" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Tipo</label>
            <input v-model="dadosEdicao.tipo" class="w-full p-2 border rounded" />
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
  </div>
</template>