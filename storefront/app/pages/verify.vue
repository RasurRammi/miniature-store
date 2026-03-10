<!-- app/pages/verify.vue -->
<script setup lang="ts">
import {VerifyCustomerAccountDocument} from "~/gql/shop/graphql";

const route = useRoute()
const toast = useToast()
const { $gqlClient } = useNuxtApp()

onMounted(async () => {
  const token = route.query.token as string
  if (!token) return navigateTo('/')

  try {
    const data = await $gqlClient.request(VerifyCustomerAccountDocument, { token })
    if ('errorCode' in data.verifyCustomerAccount) {
      toast.add({ title: 'Verification failed', color: 'error' })
      return
    }
    toast.add({ title: 'Email verified!', color: 'success' })
    navigateTo('/store/login')
  } catch {
    toast.add({ title: 'Something went wrong', color: 'error' })
    navigateTo('/')
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <p>Verifying your account...</p>
  </div>
</template>
