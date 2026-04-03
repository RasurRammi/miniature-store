import { useQuery } from '@tanstack/vue-query'
import { GetFacetsDocument, type GetFacetsQuery, SortOrder } from '~/gql/graphql'

export function useFacets() {
  const { $gqlClient } = useNuxtApp()
  const query = useQuery<GetFacetsQuery>({
    queryKey: ['facets'],
    queryFn: async () => {
      return $gqlClient.request(GetFacetsDocument, { options: { sort: { name: SortOrder.ASC } } })
    },
  })

  onServerPrefetch(async () => {
    await query.suspense()
  })

  return query
}
