import {AdminMeDocument} from "~/gql/admin/graphql";

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  if (to.path === '/admin/login') return

  const { $adminGqlClient } = useNuxtApp()

  try {
    const data = await $adminGqlClient.request(AdminMeDocument)
    if (!data.me) return navigateTo('/admin/login')
  } catch {
    return navigateTo('/admin/login')
  }
})
