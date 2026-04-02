import { GetBundleDocument } from '~/gql/shop/graphql'

const releasesSlug = 'releases'

export const useRootReleaseBundle = () => {
  return useAsyncData('bundles.rootReleaseBundle', async () => {
    const { $gqlClient } = useNuxtApp()
    const data = await $gqlClient.request(GetBundleDocument, { slug: releasesSlug })
    if (!data.collection) {
      throw new Error('Releases Bundles isn\'t initiated or doesnt have the slug "releases"')
    }
    return data.collection
  })
}
