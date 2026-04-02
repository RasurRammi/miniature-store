import { useMutation } from '@tanstack/vue-query'
import { RegisterDocument } from '~/gql/shop/graphql'

export function useRegister() {
  const { $gqlClient } = useNuxtApp()

  return useMutation({
    mutationFn: (input: {
      emailAddress: string
      password: string
      firstName: string
      lastName: string
    }) => $gqlClient.request(RegisterDocument, { input })
  })
}
