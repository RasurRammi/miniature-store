import {AdminMeDocument} from "~/gql/graphql";

export const useUser = () => {
  return useAsyncData('auth.user', async () => {
    const { $gqlClient } = useNuxtApp()
    try {
      const data = await $gqlClient.request(AdminMeDocument)
      return data.me ?? null
    }
    catch {
      return null
    }
  }, {
    server: true,
    lazy: false,
  })
}
