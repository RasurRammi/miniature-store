<script setup lang="ts">

const { headerLogo, logoAlt } = defineProps<{ headerLogo: string, logoAlt: string }>()
const { data: user } = useUser()
const isLoggedIn = computed(() => !!user.value)

const navItems = [
  {
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/',
  },
  {
    label: 'Store',
    icon: 'i-lucide-shopping-cart',
    to: '/products',
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

const logoutMut = useLogout()
const userNavItems = computed(() => {
    if (!user.value) return []
    return [
      [
        {
          label: user.value.identifier,
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

</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <img
          :src="headerLogo"
          :alt="logoAlt"
          loading="lazy"
          class="size-12"
        >
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="navItems"
      content-orientation="vertical"
    />

    <template #body>
      <UNavigationMenu
        :items="navItems"
        class="-mx-2.5"
        orientation="vertical"
      />
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        target="_blank"
        icon="i-lucide-mail"
        color="neutral"
        variant="ghost"
      />

      <UDropdownMenu
        v-if="isLoggedIn"
        :items="userNavItems"
      >
        <UButton
          icon="i-lucide-user"
          color="neutral"
          variant="ghost"
        />
      </UDropdownMenu>
      <UButton
        v-else
        color="primary"
        variant="solid"
        to="/store/login"
        label="Login"
      />
    </template>
  </UHeader>
</template>

<style scoped>

</style>
