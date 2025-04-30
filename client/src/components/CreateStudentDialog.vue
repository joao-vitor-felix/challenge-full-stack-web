<script setup lang="ts">
import { useCreateStudent } from "@/composables/useCreateStudent";
import { createStudentSchema, type CreateStudentSchema } from "@/schemas/createStudentSchema";
import { errorMessageMap } from "@/types/Error";
import { maskInput } from "@/utils/maskInput";
import { useForm } from "@tanstack/vue-form";
import { useQueryClient } from "@tanstack/vue-query";
import { onUnmounted } from "vue";
import { toast } from "vue3-toastify";

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
    mutation.mutate(
      {
        ...value,
        cpf: value.cpf.replace(/\D/g, "")
      },
      {
        onSuccess: () => {
          closeDialog();
          queryClient.invalidateQueries({
            queryKey: ["students"]
          });
          formApi.reset();
          toast.success("Cadastro realizado!");
        },
        onError: ({ response }) => {
          const code = response?.data.code;

          if (
            code === "EMAIL_ALREADY_TAKEN" ||
            code === "RA_ALREADY_TAKEN" ||
            code === "CPF_ALREADY_TAKEN"
          ) {
            toast.error(errorMessageMap[code]);
            return;
          }

          toast.error(errorMessageMap["INTERNAL_SERVER_ERROR"]);
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
                label="RA"
                placeholder="Digite o RA"
                maxlength="11"
              />
            </template>
          </form.Field>

          <form.Field name="cpf">
            <template v-slot="{ field, state }">
              <v-text-field
                :name="field.name"
                :model-value="field.state.value"
                @update:modelValue="
                  text => {
                    const masked = maskInput(text, '###.###.###-##');
                    field.handleChange(masked);
                  }
                "
                @blur="field.handleBlur"
                :error-messages="state.meta.errors[0]?.message"
                label="CPF"
                placeholder="Digite o CPF"
                maxlength="14"
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
                placeholder="Digite o e-mail"
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
