<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import { ROLES } from "@/constants/ROLES";
import { useForm } from "@tanstack/vue-form";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useSignUp } from "./composables/useSignUp";
import { type SignUpSchema, signUpSchema } from "./schemas/signUpSchema";

const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const { mutate } = useSignUp();
const router = useRouter();

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value;
}

function toggleConfirmPasswordVisibility() {
  isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
}

const form = useForm({
  defaultValues: {
    name: "",
    email: "",
    role: undefined,
    password: "",
    confirmPassword: ""
  } as unknown as SignUpSchema,
  validators: {
    onSubmit: signUpSchema
  },
  onSubmit: async ({ value }) => {
    mutate(
      {
        name: value.name,
        email: value.email,
        role: value.role,
        password: value.password
      },
      {
        onSuccess: data => {
          //TODO: add toast
          router.push(`/sign-in?email=${data.email}`);
        },
        onError: () => {
          //TODO: add toast
        }
      }
    );
  }
});
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5" width="500px">
      <Logo />
      <v-card-title class="text-subtitle-1">Cadastre-se para acessar a plataforma</v-card-title>
      <div class="ps-4 text-subtitle-2">
        <span> Já tem uma conta? </span>
        <RouterLink to="/sign-in" class="text-secondary font-weight-bold">Entre aqui</RouterLink>
      </div>

      <v-card-text>
        <v-form @submit.prevent.stop="form.handleSubmit" class="d-flex flex-column ga-2">
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

          <form.Field name="role">
            <template v-slot="{ field, state }">
              <v-select
                placeholder="Selecione o cargo"
                label="Cargo"
                :items="ROLES"
                item-title="label"
                item-value="value"
                :name="field.name"
                :model-value="field.state.value"
                @update:modelValue="field.handleChange"
                @blur="field.handleBlur"
                :error-messages="state.meta.errors[0]?.message"
              />
            </template>
          </form.Field>

          <form.Field name="password">
            <template v-slot="{ field, state }">
              <v-text-field
                :name="field.name"
                :model-value="field.state.value"
                @update:modelValue="field.handleChange"
                @blur="field.handleBlur"
                :error-messages="state.meta.errors[0]?.message"
                label="Senha"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="togglePasswordVisibility"
              />
            </template>
          </form.Field>

          <form.Field name="confirmPassword">
            <template v-slot="{ field, state }">
              <v-text-field
                :name="field.name"
                :model-value="field.state.value"
                @update:modelValue="field.handleChange"
                @blur="field.handleBlur"
                :error-messages="state.meta.errors[0]?.message"
                label="Confirme a senha"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="
                  isConfirmPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                @click:append-inner="toggleConfirmPasswordVisibility"
              />
            </template>
          </form.Field>

          <v-btn class="align-self-center w-100" color="secondary" type="submit">Cadastrar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
