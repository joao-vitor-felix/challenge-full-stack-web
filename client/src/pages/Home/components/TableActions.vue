<script setup lang="ts">
import UpdateStudentDialog from "@/components/UpdateStudentDialog.vue";
import type { Student } from "@/types/Student";
import { ref } from "vue";
import DeleteStudentDialog from "./DeleteStudentDialog.vue";

defineProps<{
  student: Student;
}>();

const isUpdateDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
</script>

<template>
  <div class="d-flex align-center">
    <v-icon
      size="small"
      class="me-2"
      color="secondary"
      icon="mdi-pencil"
      @click="isUpdateDialogOpen = true"
    />
    <v-icon
      size="small"
      class="me-2"
      color="primary"
      icon="mdi-delete"
      @click="isDeleteDialogOpen = true"
    />
    <UpdateStudentDialog
      v-if="isUpdateDialogOpen"
      v-model:isOpen="isUpdateDialogOpen"
      :student="student"
    />
    <DeleteStudentDialog
      v-model:isOpen="isDeleteDialogOpen"
      :ra="student.ra"
      :name="student.name"
    />
  </div>
</template>
