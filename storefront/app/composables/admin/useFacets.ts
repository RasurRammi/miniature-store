import { useQuery } from '@tanstack/vue-query'
import { GetFacetsDocument, SortOrder } from '~/gql/admin/graphql'

export function useFacets() {
  const { $adminGqlClient } = useNuxtApp()
  const query = useQuery({
    queryKey: ['facets'],
    queryFn: async () => {
      return $adminGqlClient.request(GetFacetsDocument, { options: { sort: { name: SortOrder.ASC } } })
    },
  })

  onServerPrefetch(async () => {
    await query.suspense()
  })

  return query
}
