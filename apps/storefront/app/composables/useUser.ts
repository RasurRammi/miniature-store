import { ShopMeDocument } from '~/gql/graphql'

export const useUser = () => {
  return useAsyncData('auth.user', async () => {
    const { $gqlClient } = useNuxtApp()
    try {
      const data = await $gqlClient.request(ShopMeDocument)
      return data.me ?? null
    }
    catch {
      return null
    }
  }, {
    server: true,
    lazy: false,
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  })
}
