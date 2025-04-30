<script setup lang="ts">
import Logo from "@/components/Logo.vue";
import { authStore } from "@/store/authStore";
import { errorMessageMap } from "@/types/Error";
import { useForm } from "@tanstack/vue-form";
import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useSignIn } from "./composables/useSignIn";
import { signInSchema, type SignInSchema } from "./schemas/signInSchema";

const isPasswordVisible = ref(false);
const { mutate } = useSignIn();
const router = useRouter();
const route = useRoute();

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value;
}
const form = useForm({
  defaultValues: {
    email: route.query.email || "",
    password: ""
  } as SignInSchema,
  validators: {
    onSubmit: signInSchema
  },
  onSubmit: async ({ value }) => {
    mutate(
      {
        email: value.email,
        password: value.password
      },
      {
        onSuccess: data => {
          authStore.login(data.accessToken, data.refreshToken);
          router.push("/");
        },
        onError: ({ response }) => {
          const code = response?.data.code;

          if (code === "PASSWORD_MISMATCH" || code === "STAFF_NOT_FOUND") {
            toast.error(errorMessageMap[code]);
            return;
          }

          toast.error(errorMessageMap["INTERNAL_SERVER_ERROR"]);
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
      <v-card-title class="text-subtitle-1 mb-2"
        >Gerencia seus estudantes agora! Acesse sua conta.</v-card-title
      >
      <v-card-text>
        <v-form @submit.prevent.stop="form.handleSubmit" class="d-flex flex-column ga-3">
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

          <div class="mb-1">
            <span>Não possui uma conta? </span>
            <RouterLink class="text-primary font-weight-bold" to="/sign-up"
              >Crie sua conta</RouterLink
            >
          </div>

          <v-btn class="align-self-center w-100" color="primary" type="submit">Entrar</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
