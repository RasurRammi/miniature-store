import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { GetFacetsDocument, type GetFacetsQuery, SortOrder } from '~/gql/admin/graphql'

export function useFacets() {
  const { $adminGqlClient } = useNuxtApp()
  const query: UseQueryReturnType<GetFacetsQuery, Error> = useQuery({
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
