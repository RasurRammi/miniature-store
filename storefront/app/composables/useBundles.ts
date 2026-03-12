import { useQuery } from '@tanstack/vue-query'
import { GetBundleDocument, GetBundlesDocument } from '~/gql/shop/graphql'

const releasesSlug = 'releases'

export function useBundles(releases: boolean = true) {
  const { $gqlClient } = useNuxtApp()
  const type = releases ? 'releases' : 'collections'
  return useQuery({
    queryKey: ['bundles', type],
    queryFn: async () => {
      if (releases) {
        const { collection } = await $gqlClient.request(GetBundleDocument, { slug: releasesSlug })
        if (!collection) {
          throw new Error('Releases Bundles isn\'t initiated or doesnt have the slug "releases"')
        }
        return $gqlClient.request(GetBundlesDocument, { options: { filter: { parentId: { eq: collection.id } } } })
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
