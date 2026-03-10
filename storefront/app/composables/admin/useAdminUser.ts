import { useQuery } from '@tanstack/vue-query'
import { AdminMeDocument } from '~/gql/admin/graphql'

export function useAdminUser() {
  const { $adminGqlClient } = useNuxtApp()

  return useQuery({
    queryKey: ['admin', 'me'],
    queryFn: async () => {
      try {
        return await $adminGqlClient.request(AdminMeDocument)
      } catch (e: any) {
        if (e?.response?.errors?.[0]?.extensions?.code === 'FORBIDDEN') {
          return { me: null }
        }
        throw e
      }
    },
    staleTime: 0,
    retry: false,
  })
}
