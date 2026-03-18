import { useQuery } from '@tanstack/vue-query'
import { GetFacetsDocument } from '~/gql/admin/graphql'

export function useFacets() {
  const { $adminGqlClient } = useNuxtApp()
  const query = useQuery({
    queryKey: ['facets'],
    queryFn: async () => {
      return $adminGqlClient.request(GetFacetsDocument)
    },
  })

  onServerPrefetch(async () => {
    await query.suspense()
  })

  return query
}
