import { useQuery } from '@tanstack/vue-query'
import { GetProductsDocument } from '~/gql/shop/graphql'

export function useProducts() {
  const { $gqlClient } = useNuxtApp()
  const query = useQuery({
    queryKey: ['products'],
    queryFn: () => $gqlClient.request(GetProductsDocument),
  })

  onServerPrefetch(async () => {
    await query.suspense()
  })

  return query
}
