import type { User } from '~/gql/shop/graphql'

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
export const useAdminNav = () => {
  return [{
    label: 'Administration',
    icon: 'i-lucide-shield',
    to: '/admin/administration/releases',
    children: useAdministrationNav(),
  }]
}
export const useAdministrationNav = () => {
  return [
    {
      label: 'Releases',
      icon: 'i-lucide-package-2',
      to: '/admin/administration/releases',
    },
    {
      label: 'Collections',
      icon: 'i-lucide-book-copy',
      to: '/admin/administration/collections',
    },
    {
      label: 'Product Tags',
      icon: 'i-lucide-tag',
      to: '/admin/administration/tags',
    },
    {
      label: 'Settings',
      icon: 'i-lucide-cog',
      to: '/admin/administration/settings',
    },
  ]
}
