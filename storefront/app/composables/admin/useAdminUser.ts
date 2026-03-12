import { AdminMeDocument } from '~/gql/admin/graphql'

export const useAdminUser = () => {
  return useAsyncData('auth.adminUser', async () => {
    const { $adminGqlClient } = useNuxtApp()
    try {
      const data = await $adminGqlClient.request(AdminMeDocument)
      return data.me ?? null
    }
    catch {
      return null
    }
  }, {
    server: true,
    lazy: false,
  })
}
