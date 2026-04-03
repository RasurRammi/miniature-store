import { useQuery } from '@tanstack/vue-query'
import { GetBundlesDocument } from '~/gql/graphql'
import { useRootReleaseBundle } from '~/composables/useRootReleaseBundle'

const releasesSlug = 'releases'

export function useBundles(releases: boolean = true) {
  const { $gqlClient } = useNuxtApp()
  const type = releases ? 'releases' : 'collections'
  const query = useQuery({
    queryKey: [type],
    queryFn: async () => {
      if (releases) {
        const { data: rootReleaseCol } = await useRootReleaseBundle()
        if (!rootReleaseCol.value) {
          throw new Error('Release Collection hasnt been set up, run the npm seed script!')
        }
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

  onServerPrefetch(async () => {
    await query.suspense()
  })

  return query
}
