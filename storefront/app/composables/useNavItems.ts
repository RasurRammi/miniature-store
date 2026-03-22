import type { User } from '~/types/fragmentAliases'

export const useDefaultNavItems = () => {
  return [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
    },
    {
      label: 'Store',
      icon: 'i-lucide-shopping-cart',
      to: '/store/products',
    },
    {
      label: 'Community',
      icon: 'i-lucide-users',
      to: '/',
      children: [
        {
          label: 'FAQ',
          icon: 'i-lucide-badge-question-mark',
          to: '/',
        },
        {
          label: 'Discord',
          icon: 'i-simple-icons-discord',
          to: '/',
          target: '_blank',
        },
        {
          label: 'Patreon',
          icon: 'i-simple-icons-patreon',
          to: '/',
          target: '_blank',
        },
      ],
    },
  ]
}

export const useUserNav = (currentUser: Ref<User | null>) => {
  const logoutMut = useLogout()
  return computed(() => {
    if (!currentUser.value) return []
    return [
      [
        {
          label: currentUser.value.identifier,
          type: 'label',
        },
      ],
      [
        {
          label: 'Profile',
          icon: 'i-lucide-user',
        },
        {
          label: 'Settings',
          icon: 'i-lucide-cog',
        },
      ],
      [
        {
          label: 'Logout',
          icon: 'i-lucide-log-out',
          onSelect: logoutMut.mutate,
        },
      ],
    ]
  })
}
