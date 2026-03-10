import {useMutation, useQueryClient} from '@tanstack/vue-query'
import { LoginDocument } from '~/gql/admin/graphql'

export function useAdminLogin() {
  const { $adminGqlClient } = useNuxtApp()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (input: { username: string, password: string }) =>
      $adminGqlClient.request(LoginDocument, input),
    onSuccess: (data) => {
      toast.add({
        title: 'Admin Login Success',
        description: data.login.message,
        icon: 'i-lucide-check',
        color: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['me'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'me'] })
      navigateTo('/admin/products')
    },
    onError: (err) => {
      console.log(err)
      toast.add({
        title: 'Login Failed',
        description: JSON.stringify(err),
        icon: 'i-lucide-x',
        color: 'error'
      })
    }
  })
}
