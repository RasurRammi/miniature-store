import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ShopLogoutDocument } from '~/gql/shop/graphql'
import { AdminLogoutDocument } from '~/gql/admin/graphql'

export function useLogout() {
  const { $gqlClient, $adminGqlClient } = useNuxtApp()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: async () => {
      await Promise.all([
        $gqlClient.request(ShopLogoutDocument),
        $adminGqlClient.request(AdminLogoutDocument),
      ])
    },
    onSuccess: () => {
      toast.add({
        title: 'Logout successful',
        icon: 'i-lucide-check',
        color: 'success',
      })
      queryClient.refetchQueries({ queryKey: ['me'] })
      queryClient.refetchQueries({ queryKey: ['admin', 'me'] })
      navigateTo('/store/login')
    },
    onError: () => {
      toast.add({
        title: 'Logout failed',
        icon: 'i-lucide-check',
        color: 'error',
      })
    }
  })
}
