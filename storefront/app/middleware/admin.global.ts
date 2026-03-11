import {AdminMeDocument} from "~/gql/admin/graphql";
import {useToast} from "../../.nuxt/imports";

export default defineNuxtRouteMiddleware(async (to) => {

  if (
    !to.path.startsWith('/admin')
    || to.path === '/admin/login'
    || import.meta.server
  ) {
    return
  }

  // Check for admin rights, otherwise redirect to admin login
  const { $adminGqlClient } = useNuxtApp()
  const toast = useToast();
  const loginNeededMsg = {
    title: "Login",
    description: "Login to your account",
    color: 'error',
  }

  try {
    const data = await $adminGqlClient.request(AdminMeDocument)
    if (!data.me) {
      toast.add(loginNeededMsg)
      return navigateTo('/admin/login')
    }

    if (to.path.startsWith('/admin/administration')) {
      setPageLayout('admin-administration')
    }
  } catch {
    toast.add(loginNeededMsg)
    return navigateTo('/admin/login')
  }
})
