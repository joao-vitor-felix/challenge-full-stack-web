<script setup lang="ts">
import { studentsTableHeaders } from "@/utils/studentsTableHeaders";
import { ref } from "vue";
import { useListStudents } from "../composables/useListStudents";

const page = ref(1);
const pageSize = ref(2);
const search = ref("");

const {
  data: response,
  refetch,
  isError,
  isLoading,
  isFetching
} = useListStudents(page, pageSize, search);

function handleSearch() {
  if (page.value !== 1) {
    page.value = 1;
  }

  refetch();
}

const isEmptyResponse = !isLoading && !isFetching && !isError && !response.value?.data.length;
</script>

<template>
  <v-container class="d-flex flex-column ga-6">
    <div class="d-flex align-center w-100 justify-space-between">
      <div class="d-flex align-center w-50 ga-4">
        <v-text-field
          max-width="70%"
          placeholder="Digite aqui..."
          density="compact"
          hide-details
          v-model="search"
          @keyup.enter="handleSearch"
        />
        <v-btn width="w-100" color="black" append-icon="mdi-magnify" @click="handleSearch"
          >Pesquisar</v-btn
        >
      </div>

      <v-btn color="primary" class="ml-2 justify-end" append-icon="mdi-plus">Cadastrar Aluno</v-btn>
    </div>

    <v-data-table
      v-if="!isError"
      :headers="studentsTableHeaders"
      :header-props="{
        style: 'font-weight: 600'
      }"
      :items="isLoading || isFetching ? [] : response && response.data"
      :items-per-page="pageSize"
      :loading="isLoading || isFetching"
      loading-text=""
    >
      <template v-slot:loader>
        <v-skeleton-loader type="table-tbody" class="pt-2"></v-skeleton-loader>
      </template>

      <template v-slot:no-data>
        <div class="text-center mt-4" v-if="isEmptyResponse">
          <v-icon size="large" icon="mdi-alert-circle-outline" />
          <p class="mt-2">Nenhum aluno encontrado</p>
        </div>
      </template>

      <template v-slot:bottom>
        <div class="text-center pt-2" v-if="response && response.pagination">
          <v-pagination
            v-model="page"
            :length="response.pagination.totalPages"
            rounded="circle"
            size="small"
          />
        </div>
      </template>
    </v-data-table>

    <div class="d-flex ga-4 flex-column justify-center w-33 align-self-center" v-else>
      <v-alert type="error" color="primary" icon="mdi-alert-circle-outline">
        <p class="text-center">Erro ao carregar os alunos</p>
      </v-alert>
      <v-btn @click="handleSearch">Tentar novamente</v-btn>
    </div>
  </v-container>
</template>
