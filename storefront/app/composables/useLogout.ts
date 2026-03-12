import { useMutation } from '@tanstack/vue-query'
import { ShopLogoutDocument } from '~/gql/shop/graphql'
import { AdminLogoutDocument } from '~/gql/admin/graphql'

export function useLogout() {
  const { $gqlClient, $adminGqlClient } = useNuxtApp()
  const toast = useToast()

  return useMutation({
    mutationFn: async () => {
      await Promise.all([
        $gqlClient.request(ShopLogoutDocument),
        $adminGqlClient.request(AdminLogoutDocument),
      ])
    },
    onSuccess: async () => {
      toast.add({
        title: 'Logout successful',
        icon: 'i-lucide-check',
        color: 'success',
      })
      await refreshNuxtData('auth.user')
      await refreshNuxtData('auth.adminUser')
      navigateTo('/store/login')
    },
    onError: () => {
      toast.add({
        title: 'Logout failed',
        icon: 'i-lucide-check',
        color: 'error',
      })
    },
  })
}
