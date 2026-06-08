<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apartmentService } from '@/services/apartment.service';
import type { ApartamentoResponse } from '@/types/api';

const apartamentos = ref<ApartamentoResponse[]>([]);
const carregando = ref(true);
const salvando = ref(false);
const errorMessage = ref('');

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
  errorMessage.value = '';
  try {
    const res = await apartmentService.getAll();
    apartamentos.value = Array.isArray(res) ? res : (res.data ?? []);
  } catch {
    errorMessage.value = 'Não foi possível carregar os apartamentos.';
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
  errorMessage.value = '';
  try {
    await apartmentService.create(novoApartamento.value);
    novoApartamento.value = { numero: '', bloco: '', andar: 1, tipo: '' };
    await carregar();
  } catch {
    errorMessage.value = 'Não foi possível cadastrar o apartamento.';
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
  errorMessage.value = '';
  try {
    await apartmentService.update(apartamentoEditando.value.id, dadosEdicao.value);
    fecharEdicao();
    await carregar();
  } catch {
    errorMessage.value = 'Não foi possível atualizar o apartamento.';
  } finally {
    salvandoEdicao.value = false;
  }
};

const inativar = async (id: number) => {
  if (!confirm('Deseja realmente inativar este apartamento?')) return;
  errorMessage.value = '';
  try {
    await apartmentService.desativar(id);
    await carregar();
  } catch {
    errorMessage.value = 'Não foi possível inativar o apartamento.';
  }
};

const reativar = async (id: number) => {
  if (!confirm('Deseja reativar este apartamento?')) return;
  errorMessage.value = '';
  try {
    await apartmentService.reativar(id);
    await carregar();
  } catch {
    errorMessage.value = 'Não foi possível reativar o apartamento.';
  }
};

onMounted(carregar);
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-2">
      <h2 class="font-display text-3xl text-ink-950">Gestão de Apartamentos</h2>
    </div>

    <!-- Alerta de Erro Padronizado -->
    <div v-if="errorMessage" class="surface-card border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      
      <!-- Seção da Tabela (Esquerda) -->
      <section class="surface-card p-6">
        <h3 class="font-display text-2xl text-ink-950 mb-6">Unidades Cadastradas</h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-slate-100 text-ink-700">
                <th class="pb-3 font-semibold">Número</th>
                <th class="pb-3 font-semibold">Bloco</th>
                <th class="pb-3 font-semibold">Andar</th>
                <th class="pb-3 font-semibold">Tipo</th>
                <th class="pb-3 font-semibold">Status</th>
                <th class="pb-3 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="carregando">
                <td colspan="6" class="py-4 text-center text-ink-700">Carregando apartamentos...</td>
              </tr>
              <tr v-else-if="apartamentos.length === 0">
                <td colspan="6" class="py-6 text-center text-ink-700 rounded-xl border border-dashed border-slate-300">
                  Nenhum apartamento cadastrado.
                </td>
              </tr>
              <tr v-for="ap in apartamentos" :key="ap.id" v-else class="border-b border-slate-100 hover:bg-slate-500/5 transition">
                <td class="py-4 text-ink-950 font-medium">{{ ap.numero }}</td>
                <td class="py-4 text-ink-700">{{ ap.bloco }}</td>
                <td class="py-4 text-ink-700">{{ ap.andar }}º</td>
                <td class="py-4 text-ink-700">{{ ap.tipo }}</td>
                <td class="py-4">
                  <span
                    :class="ap.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                    class="px-2.5 py-1 rounded-full text-xs font-bold"
                  >
                    {{ ap.ativo ? 'ATIVO' : 'INATIVO' }}
                  </span>
                </td>
                <td class="py-4 text-right">
                  <div class="flex gap-3 justify-end">
                    <button @click="abrirEdicao(ap)" class="text-blue-600 hover:underline font-semibold">
                      Editar
                    </button>
                    <button v-if="ap.ativo" @click="inativar(ap.id)" class="text-red-600 hover:underline font-semibold">
                      Inativar
                    </button>
                    <button v-else @click="reativar(ap.id)" class="text-green-600 hover:underline font-semibold">
                      Reativar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Formulário de Cadastro (Direita) -->
      <aside class="surface-card p-6">
        <h3 class="font-display text-2xl text-ink-950 mb-6">Novo Apartamento</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Número</label>
            <input v-model="novoApartamento.numero" placeholder="ex: 101" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Bloco</label>
            <input v-model="novoApartamento.bloco" placeholder="ex: A" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Andar</label>
            <input v-model.number="novoApartamento.andar" type="number" min="1" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Tipo</label>
            <input v-model="novoApartamento.tipo" placeholder="ex: 2 quartos" class="theme-control w-full" />
          </div>

          <button
            @click="salvarApartamento"
            :disabled="salvando"
            class="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mt-2"
          >
            {{ salvando ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </aside>
    </div>

    <!-- Modal de Edição Padronizad -->
    <div v-if="apartamentoEditando" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="surface-card rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden border border-slate-200/50">
        <div class="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 class="font-display text-2xl text-ink-950">Editar Apartamento</h2>
          <button @click="fecharEdicao" class="text-ink-700 hover:text-ink-950 text-2xl font-bold">×</button>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Número</label>
            <input v-model="dadosEdicao.numero" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Bloco</label>
            <input v-model="dadosEdicao.bloco" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Andar</label>
            <input v-model.number="dadosEdicao.andar" type="number" min="1" class="theme-control w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Tipo</label>
            <input v-model="dadosEdicao.tipo" class="theme-control w-full" />
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
  </section>
</template>