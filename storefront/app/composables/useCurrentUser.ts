import { useQuery } from '@tanstack/vue-query'
import { ShopMeDocument } from '~/gql/shop/graphql'

export function useCurrentUser() {
  const { $gqlClient } = useNuxtApp()

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        return await $gqlClient.request(ShopMeDocument)
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
