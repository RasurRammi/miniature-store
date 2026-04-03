<script setup lang="ts">
import { useAdminUser } from '~/composables/admin/useUser'
import { useDefaultNavItems, useUserNav } from '~/composables/useNavItems'

const { headerLogo, logoAlt } = defineProps<{ headerLogo: string, logoAlt: string }>()
const { data: adminUser } = useAdminUser()
const { data: currentUser } = useCurrentUser()
const isLoggedIn = computed(() => !!currentUser.value)

const defaultNavItems = useDefaultNavItems()
const navItems = computed(() => getNavItems())
const userNavItems = useUserNav(currentUser)

function getNavItems() {
  const nav = defaultNavItems
  if (adminUser.value) {
    nav.push(
      {
        label: 'To Admin Dashboard',
        icon: 'i-lucide-shield',
        to: '/admin/catalogue/releases',
      },
    )
  }
  return nav
}
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
