import { AdminMeDocument } from '~/gql/admin/graphql'
import { type Toast, useToast } from '#ui/composables'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/admin')) {
    setPageLayout('admin')
  }

  if (
    !to.path.startsWith('/admin')
    || import.meta.server
  ) {
    return
  }

  // Check for admin rights, otherwise redirect to admin login
  const { $adminGqlClient } = useNuxtApp()
  const toast = useToast()
  const loginNeededMsg: Partial<Toast> = {
    title: 'Login',
    description: 'Login to your account',
    color: 'error',
  }

  try {
    const data = await $adminGqlClient.request(AdminMeDocument)

    if (data.me && to.path === '/admin/login') {
      return navigateTo('/admin/releases')
    }
    if (!data.me && to.path !== '/admin/login') {
      toast.add(loginNeededMsg)
      return navigateTo('/admin/login')
    }
  }
  catch {
    if (to.path !== '/admin/login') {
      toast.add(loginNeededMsg)
      return navigateTo('/admin/login')
    }
  }
})
