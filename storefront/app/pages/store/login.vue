<!-- app/pages/admin/login.vue -->
<script setup lang="ts">
import { useCustomerLogin } from '~/composables/useLogin'

const form = reactive({
  username: '',
  password: ''
})

const { mutate, isPending, isError, error } = useCustomerLogin()

const toast = useToast()
function submit() {
  mutate(form, {
    onSuccess: (data) => {
      toast.add({
        title: 'Login Success',
        description: data.login.message,
        icon: 'i-lucide-check',
        color: 'success'
      })
      navigateTo('/store/products')
    },
    onError: (err) => {
      console.log(err)
      toast.add({
        title: 'Login Failed',
        description: JSON.stringify(err),
        icon: 'i-lucide-x',
        color: 'error'
      })
    }
  })
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col gap-4 w-80">
      <h1 class="text-2xl font-bold">
        Login
      </h1>

      <UInput
        v-model="form.username"
        placeholder="E-Mail"
      />
      <UInput
        v-model="form.password"
        type="password"
        placeholder="Password"
      />
      <NuxtLink
        to="/store/register"
        class="text-center text-sm text-muted hover:text-primary transition-colors"
      >
        No Account yet? Register here!
      </NuxtLink>
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
