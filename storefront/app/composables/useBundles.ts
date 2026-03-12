import { useQuery } from '@tanstack/vue-query'
import { GetBundlesDocument } from '~/gql/shop/graphql'
import { useRootReleaseBundle } from '~/composables/useRootReleaseBundle'

const releasesSlug = 'releases'

export function useBundles(releases: boolean = true) {
  const { $gqlClient } = useNuxtApp()
  const type = releases ? 'releases' : 'collections'
  return useQuery({
    queryKey: ['bundles', type],
    queryFn: async () => {
      if (releases) {
        const { data: rootReleaseCol } = await useRootReleaseBundle()
        return $gqlClient.request(GetBundlesDocument, { options: { filter: { parentId: { eq: rootReleaseCol.value.id } } } })
      }
      else {
        return $gqlClient.request(GetBundlesDocument, {
          options: {
            topLevelOnly: true,
            filter: { slug: { notEq: releasesSlug } },
          },
        })
      }
    },
  })
}
