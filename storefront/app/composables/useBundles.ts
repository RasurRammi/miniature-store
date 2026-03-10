import { useQuery } from '@tanstack/vue-query'
import {GetBundlesDocument} from "../gql/shop/graphql";

export function useBundles() {
  const { $gqlClient } = useNuxtApp()
  return useQuery({
    queryKey: ['bundles'],
    queryFn: () => $gqlClient.request(GetBundlesDocument)
  })
}
