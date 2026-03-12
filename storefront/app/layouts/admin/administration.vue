<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const navItems: NavigationMenuItem[] = [
  {
    label: 'Releases',
    icon: 'i-lucide-package-2',
    to: '/admin/administration/bundles',
  },
  {
    label: 'Settings',
    icon: 'i-lucide-cog',
    to: '/admin/administration/settings',
  },
]
</script>

<template>
  <NuxtLayout name="default">
    <UContainer>
      <div class="flex flex-row">
        <div class="w-1/5">
          <h2 class="text-bold text-lg p-2">
            Navigation
          </h2>
          <UNavigationMenu
            :items="navItems"
            :orientation="'vertical'"
          />
        </div>

        <div class="w-4/5">
          <slot />
        </div>
      </div>
    </UContainer>
  </NuxtLayout>
</template>
