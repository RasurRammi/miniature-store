import { GraphQLClient } from 'graphql-request'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const requestURL = useRequestURL()

  const origin = import.meta.server
    ? requestURL.origin
    : window.location.origin

  const gqlClient = new GraphQLClient(`${origin}${config.public.shopApiUrl}`)
  const adminGqlClient = new GraphQLClient(`${origin}${config.public.adminApiUrl}`)

  return {
    provide: { gqlClient, adminGqlClient }
  }
})
