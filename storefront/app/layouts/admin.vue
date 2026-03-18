<script setup lang="ts">
const navItems = [
  {
    label: 'To Webstore',
    icon: 'i-lucide-store',
    to: '/store/products',
  },
  {
    label: 'Releases',
    icon: 'i-lucide-package-2',
    to: '/admin/releases',
  },
  {
    label: 'Collections',
    icon: 'i-lucide-book-copy',
    to: '/admin/collections',
  },
  {
    label: 'Product Tags',
    icon: 'i-lucide-tag',
    to: '/admin/tags',
  },
  {
    label: 'Settings',
    icon: 'i-lucide-cog',
    to: '/admin/settings',
  },
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar>
      <template #header>
        Miniature Store Base
      </template>

      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
      />
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar title="Admin Dashboard" />
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
