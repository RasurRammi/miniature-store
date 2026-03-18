import { useQuery } from '@tanstack/vue-query'
import { GetAssetsDocument } from '~/gql/admin/graphql'

export function useAssets() {
  const { $adminGqlClient } = useNuxtApp()
  const query = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      return $adminGqlClient.request(GetAssetsDocument)
    },
  })

  onServerPrefetch(async () => {
    await query.suspense()
  })

  return query
}
