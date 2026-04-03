import { useQuery } from '@tanstack/vue-query'
import { GetProductDocument } from '~/gql/graphql'

export function useProduct(id: string) {
  const { $gqlClient } = useNuxtApp()

  const query = useQuery({
    queryKey: ['product', id],
    queryFn: () => $gqlClient.request(GetProductDocument, { id }),
    staleTime: 5000,
  })

  onServerPrefetch(async () => {
    await query.suspense()
  })

  return query
}
