<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import { authStore } from "@/store/authStore";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isActive = route.path === "/";

function handleLogout() {
  authStore.logout();
  router.push({ name: "sign-in" });
}
</script>

<template>
  <v-navigation-drawer mobile-breakpoint="sm">
    <Logo />
    <div class="d-flex align-center">
      <span class="w-100 text-center font-weight-bold">Módulo acadêmico</span>
    </div>
    <v-list>
      <v-list-item prepend-icon="mdi-account" :active="isActive" active-color="secondary"
        >Alunos</v-list-item
      >
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block color="black" @click="handleLogout">Sair</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
