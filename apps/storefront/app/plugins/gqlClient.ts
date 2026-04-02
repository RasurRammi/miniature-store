import { GraphQLClient } from 'graphql-request'
import { getRequestHeader } from 'h3'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const requestURL = useRequestURL()
  const origin = import.meta.server ? requestURL.origin : window.location.origin

  const headers: Record<string, string> = {}

  if (import.meta.server) {
    const event = useRequestEvent()
    const cookie = getRequestHeader(event!, 'cookie')
    if (cookie) headers['cookie'] = cookie
  }

  const gqlClient = new GraphQLClient(`${origin}${config.public.shopApiUrl}`, { headers })
  const adminGqlClient = new GraphQLClient(`${origin}${config.public.adminApiUrl}`, { headers })

  return {
    provide: { gqlClient, adminGqlClient },
  }
})
