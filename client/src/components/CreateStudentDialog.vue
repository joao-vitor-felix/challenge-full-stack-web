<script setup lang="ts">
import { useCreateStudent } from "@/composables/useCreateStudent";
import { createStudentSchema, type CreateStudentSchema } from "@/schemas/createStudentSchema";
import { useForm } from "@tanstack/vue-form";
import { useQueryClient } from "@tanstack/vue-query";
import { onUnmounted } from "vue";

defineProps<{
  isOpen: boolean;
}>();
const emit = defineEmits(["update:isOpen"]);

const queryClient = useQueryClient();
const mutation = useCreateStudent();

const form = useForm({
  defaultValues: {
    ra: "",
    cpf: "",
    name: "",
    email: ""
  } as CreateStudentSchema,
  validators: {
    onSubmit: createStudentSchema
  },
  onSubmit: async ({ value, formApi }) => {
    mutation.mutate(value, {
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
    });
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
    <v-card title="Cadastro de aluno">
      <v-card-subtitle class="text-subtitle-1 pl-6"> Preencha os dados do aluno </v-card-subtitle>
      <v-card-text>
        <v-form @submit.prevent.stop="form.handleSubmit" class="d-flex flex-column ga-2">
          <form.Field name="ra">
            <template v-slot="{ field, state }">
              <v-text-field
                :name="field.name"
                :model-value="field.state.value"
                @update:modelValue="field.handleChange"
                @blur="field.handleBlur"
                :error-messages="state.meta.errors[0]?.message"
                label="Digite o RA"
              />
            </template>
          </form.Field>

          <form.Field name="cpf">
            <template v-slot="{ field, state }">
              <v-text-field
                :name="field.name"
                :model-value="field.state.value"
                @update:modelValue="field.handleChange"
                @blur="field.handleBlur"
                :error-messages="state.meta.errors[0]?.message"
                label="Digite o CPF"
              />
            </template>
          </form.Field>

          <form.Field name="name">
            <template v-slot="{ field, state }">
              <v-text-field
                :name="field.name"
                :model-value="field.state.value"
                @update:modelValue="field.handleChange"
                @blur="field.handleBlur"
                label="Nome"
                :error-messages="state.meta.errors[0]?.message"
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
                label="E-mail"
                :error-messages="state.meta.errors[0]?.message"
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
              :disabled="mutation.isPending.value"
              type="submit"
              >Cadastrar</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
