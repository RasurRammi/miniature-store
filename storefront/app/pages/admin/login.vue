<!-- app/pages/admin/login.vue -->
<script setup lang="ts">
import { useAdminLogin } from '~/composables/admin/useAdminLogin'

const form = reactive({
  username: '',
  password: '',
})

const { mutate, isPending, isError, error } = useAdminLogin()

function submit() {
  mutate(form)
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col gap-4 w-80">
      <h1 class="text-2xl font-bold">
        Admin Login
      </h1>

      <UInput
        v-model="form.username"
        placeholder="Username"
      />
      <UInput
        v-model="form.password"
        type="password"
        placeholder="Password"
      />

      <p
        v-if="isError"
        class="text-red-500"
      >
        {{ error }}
      </p>

      <UButton
        :loading="isPending"
        @click="submit"
      >
        Login
      </UButton>
    </div>
  </div>
</template>
