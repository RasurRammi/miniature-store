import { useQuery } from '@tanstack/vue-query'
import { GetProductsDocument } from '~/gql/shop/graphql'

export function useProducts() {
  const { $gqlClient } = useNuxtApp()
  return useQuery({
    queryKey: ['products'],
    queryFn: () => $gqlClient.request(GetProductsDocument),
  })
}
