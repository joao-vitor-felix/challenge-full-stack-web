<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { toast } from "vue3-toastify";
import { useDeleteStudent } from "../composables/useDeleteStudent";

const props = defineProps<{
  isOpen: boolean;
  ra: string;
  name: string;
}>();

const emit = defineEmits(["update:isOpen"]);

const mutation = useDeleteStudent();
const queryClient = useQueryClient();

function handleDeleteStudent() {
  mutation.mutate(props.ra, {
    onSuccess: () => {
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: ["students"]
      });
      toast.success("Aluno deletado!");
    },
    onError: () => {
      toast.error("Falha ao deletar aluno, tente novamente.");
    }
  });
}

function closeDialog() {
  emit("update:isOpen", false);
}
</script>

<template>
  <v-dialog
    max-width="500"
    :model-value="isOpen"
    @update:model-value="emit('update:isOpen', $event)"
  >
    <v-card title="Deleção de aluno">
      <v-card-text> Desejar deletar o aluno {{ name }}? </v-card-text>

      <v-card-actions>
        <v-btn text="Close Dialog" @click="closeDialog" :disabled="mutation.isPending.value"
          >Cancelar</v-btn
        >
        <v-btn
          text="Close Dialog"
          color="primary"
          :loading="mutation.isPending.value"
          :disabled="mutation.isPending.value"
          @click="handleDeleteStudent"
          >Deletar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
