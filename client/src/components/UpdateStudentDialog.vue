<script setup lang="ts">
import { useUpdateStudent } from "@/composables/useUpdateStudent";
import { updateStudentSchema, type UpdateStudentSchema } from "@/schemas/updateStudentSchema";
import type { Student } from "@/types/Student";
import { useForm } from "@tanstack/vue-form";
import { useQueryClient } from "@tanstack/vue-query";
import { onUnmounted, ref } from "vue";

const props = defineProps<{
  student: Student;
  isOpen: boolean;
}>();
const emit = defineEmits(["update:isOpen"]);

const queryClient = useQueryClient();
const mutation = useUpdateStudent();
const isDirty = ref(false);

const form = useForm({
  defaultValues: {
    name: props.student.name ?? "",
    email: props.student.email ?? ""
  } as UpdateStudentSchema,
  validators: {
    onSubmit: updateStudentSchema
  },
  listeners: {
    onChange: ({ formApi }) => {
      isDirty.value = formApi.state.isDirty;
    }
  },
  onSubmit: async ({ value, formApi }) => {
    mutation.mutate(
      {
        ra: props.student.ra,
        email: value.email,
        name: value.name
      },
      {
        onSuccess: () => {
          closeDialog();
          queryClient.invalidateQueries({
            queryKey: ["students"]
          });
          formApi.reset();
          //TODO: add toast
        },
        onError: () => {
          //TODO: add toast
        }
      }
    );
  }
});

function closeDialog() {
  emit("update:isOpen", false);
}

onUnmounted(() => {
  form.reset();
});
</script>

<template>
  <v-dialog
    max-width="500"
    :model-value="isOpen"
    @update:model-value="emit('update:isOpen', $event)"
  >
    <v-card title="Atualização de aluno">
      <v-card-subtitle class="text-subtitle-1 pl-6">Preencha os dados do aluno</v-card-subtitle>
      <v-card-text>
        <v-form @submit.prevent.stop="form.handleSubmit" class="d-flex flex-column ga-2">
          <v-text-field v-model="student.ra" disabled label="RA" />
          <v-text-field v-model="student.cpf" disabled label="CPF" />

          <form.Field name="name">
            <template v-slot="{ field, state }">
              <v-text-field
                :name="field.name"
                :model-value="field.state.value"
                @update:modelValue="field.handleChange"
                @blur="field.handleBlur"
                :error-messages="state.meta.errors[0]?.message"
                label="Nome"
                placeholder="Digite o nome"
              />
            </template>
          </form.Field>

          <form.Field name="email">
            <template v-slot="{ field, state }">
              <v-text-field
                :name="field.name"
                :model-value="field.state.value"
                @update:modelValue="field.handleChange"
                @blur="field.handleBlur"
                :error-messages="state.meta.errors[0]?.message"
                label="E-mail"
                placeholder="Digite o nome"
              />
            </template>
          </form.Field>
          <v-card-actions class="justify-end">
            <v-btn
              text="Close Dialog"
              @click="closeDialog"
              :disabled="mutation.isPending.value"
              type="button"
              >Cancelar</v-btn
            >
            <v-btn
              text="Close Dialog"
              color="secondary"
              :loading="mutation.isPending.value"
              :disabled="mutation.isPending.value || !isDirty"
              type="submit"
              >Atualizar</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
