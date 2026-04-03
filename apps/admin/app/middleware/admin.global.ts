import { AdminMeDocument } from '~/gql/graphql'
import { type Toast, useToast } from '#ui/composables'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  // Check for admin rights, otherwise redirect to admin login
  const { $gqlClient } = useNuxtApp()
  const toast = useToast()
  const loginNeededMsg: Partial<Toast> = {
    title: 'Not logged in',
    description: 'Login to your account',
    color: 'error',
  }

  try {
    const data = await $gqlClient.request(AdminMeDocument)

    if (data.me && (to.path === '/login' || to.path === '/')) {
      return navigateTo('/catalogue/releases', { replace: true })
    }
    if (!data.me && to.path !== '/login') {
      toast.add(loginNeededMsg)
      return navigateTo('/login')
    }
  }
  catch {
    if (to.path !== '/login') {
      toast.add(loginNeededMsg)
      return navigateTo('/login')
    }
  }
})
