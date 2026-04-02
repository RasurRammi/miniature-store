import { useMutation } from '@tanstack/vue-query'
import { LoginDocument } from '~/gql/admin/graphql'

export function useAdminLogin() {
  const { $adminGqlClient } = useNuxtApp()
  const toast = useToast()

  return useMutation({
    mutationFn: (input: { username: string, password: string }) =>
      $adminGqlClient.request(LoginDocument, input),
    onSuccess: async (data) => {
      switch (data.login.__typename) {
        case 'CurrentUser':
          toast.add({
            title: 'Admin Login Success',
            description: `Welcome back ${data.login.identifier}`,
            icon: 'i-lucide-check',
            color: 'success',
          })
          await refreshNuxtData('auth.user')
          await refreshNuxtData('auth.adminUser')
          navigateTo('/admin/catalogue/releases')
          break
        default:
          toast.add({
            title: `Login Failed: ${data.login.errorCode}`,
            description: JSON.stringify(data.login.message),
            icon: 'i-lucide-x',
            color: 'error',
          })
      }
    },
    onError: (err) => {
      console.log(err)
      toast.add({
        title: 'Connection to Auth server failed',
        description: JSON.stringify(err),
        icon: 'i-lucide-x',
        color: 'error',
      })
    },
  })
}
