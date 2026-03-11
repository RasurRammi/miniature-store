<!-- app/pages/store/register.vue -->
<script setup lang="ts">
const form = reactive({
  firstName: '',
  lastName: '',
  emailAddress: '',
  password: '',
  passwordConfirm: ''
})

const toast = useToast()
const { mutate, isPending } = useRegister()

function submit() {
  if (form.password !== form.passwordConfirm) {
    toast.add({ title: 'Passwords do not match', color: 'error' })
    return
  }

  const { passwordConfirm, ...input } = form

  mutate(input, {
    onSuccess: (data) => {
      if ('errorCode' in data.registerCustomerAccount) {
        toast.add({
          title: 'Registration failed',
          description: data.registerCustomerAccount.message,
          color: 'error'
        })
        return
      }
      toast.add({
        title: 'Registration successful',
        description: 'Please check your email to verify your account',
        color: 'success'
      })
      navigateTo('/store/login')
    },
    onError: () => {
      toast.add({ title: 'Something went wrong', color: 'error' })
    }
  })
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="flex flex-col gap-4 w-80">
      <h1 class="text-2xl font-bold">
        Register
      </h1>
      <div class="flex flex-row gap-1">
        <UInput
          v-model="form.firstName"
          placeholder="First name"
        />
        <UInput
          v-model="form.lastName"
          placeholder="Last name"
        />
      </div>
      <UInput
        v-model="form.emailAddress"
        placeholder="Email"
      />
      <UInput
        v-model="form.password"
        type="password"
        placeholder="Password"
      />
      <UInput
        v-model="form.passwordConfirm"
        type="password"
        placeholder="Confirm password"
      />
      <UButton
        :loading="isPending"
        @click="submit"
      >
        Register
      </UButton>
      <NuxtLink
        to="/store/login"
        class="text-center text-sm text-muted hover:text-primary transition-colors"
      >
        Already have an account? Login
      </NuxtLink>
    </div>
  </div>
</template>
