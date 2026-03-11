<script setup lang="ts">
import {useAdminUser} from "~/composables/admin/useAdminUser";
import type {DropdownMenuItem} from "#ui/components/DropdownMenu.vue";

const {headerLogo, logoAlt} = defineProps<{headerLogo: string, logoAlt: string}>();
const {data: adminUser} = useAdminUser()
const {data: currentUser} = useCurrentUser()
const isAdmin = computed(() => !!adminUser.value?.me)
const isLoggedIn = computed(() => !!currentUser.value?.me)

watch(() => adminUser.value?.me, (val) => console.log('me changed:', JSON.stringify(val)))

const baseNavItems = [
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
        to: '/'
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
    ]
  },
]

const navItems = computed(() => {
  if (!!adminUser.value?.me) {
    return [
      ...baseNavItems,
      {
        label: 'Administration',
        icon: 'i-lucide-cog',
        to: '/admin/administration/products',
      }
    ]
  } else {
    return [
      ...baseNavItems,
      {
        label: 'Admin Login',
        icon: 'i-lucide-cog',
        to: '/admin/login',
      }
    ]
  }
});

const logoutMut = useLogout()
const userNavItems = computed(() => {
  if (!currentUser.value) return [];
  return [
    [
      {
        label: currentUser.value.me.identifier,
        type: 'label'
      }
    ],
    [
      {
        label: 'Profile',
        icon: 'i-lucide-user'
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
        onSelect: logoutMut.mutate
      }
    ]
  ]
});
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <img :src="headerLogo" :alt="logoAlt" class="size-12" />
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="navItems"
      content-orientation="vertical"
    />

    <template #body>
      <UNavigationMenu :items="navItems" orientation="vertical" class="-mx-2.5" />
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        target="_blank"
        icon="i-lucide-mail"
        color="neutral"
        variant="ghost"
      />


      <UDropdownMenu v-if="isLoggedIn" :items="userNavItems">
        <UButton
          icon="i-lucide-user"
          color="neutral"
          variant="ghost"
        />
      </UDropdownMenu>
      <ULink v-else to="/store/login">
        <UButton
          color="primary"
          variant="solid"
        >
          Login
        </UButton>
      </ULink>
    </template>
  </UHeader>
</template>

<style scoped>

</style>
