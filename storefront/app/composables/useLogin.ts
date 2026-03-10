import { useMutation } from '@tanstack/vue-query'
import { LoginDocument } from '~/gql/shop/graphql'

export function useCustomerLogin() {
  const { $gqlClient } = useNuxtApp()

  return useMutation({
    mutationFn: (input: { username: string, password: string }) =>
      $gqlClient.request(LoginDocument, input)
  })
}
