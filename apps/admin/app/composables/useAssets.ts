import { useQuery } from '@tanstack/vue-query'
import {GetAssetsDocument} from "~/gql/graphql";

export function useAssets() {
  const { $gqlClient } = useNuxtApp()
  const query = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      return $gqlClient.request(GetAssetsDocument)
    },
  })

  onServerPrefetch(async () => {
    await query.suspense()
  })

  return query
}
