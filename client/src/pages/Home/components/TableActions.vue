<script setup lang="ts">
import { ref } from "vue";
import DeleteStudentDialog from "./DeleteStudentDialog.vue";

defineProps<{
  ra: string;
  name: string;
}>();

const isDeleteDialogOpen = ref(false);
</script>

<template>
  <div class="d-flex align-center">
    <v-icon size="small" class="me-2" color="secondary" icon="mdi-pencil" />
    <v-icon
      size="small"
      class="me-2"
      color="primary"
      icon="mdi-delete"
      @click="isDeleteDialogOpen = true"
    />
    <DeleteStudentDialog v-model:isOpen="isDeleteDialogOpen" :ra="ra" :name="name" />
  </div>
</template>
