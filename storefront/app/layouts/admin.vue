<script setup lang="ts">
const headerLogo = '/nomnom-logo.png'
const logoAlt = 'NomNom Miniatures'

const navItems = [
  [
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
  ],
  [
    {
      label: 'To Webstore',
      icon: 'i-lucide-store',
      to: '/store/products',
    },
  ],
]
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #header="{ collapsed }">
        <div class="flex flex-row items-center gap-2">
          <img
            :src="headerLogo"
            :alt="logoAlt"
            :class="{ 'size-7.75': !collapsed }"
          >
          <span v-if="!collapsed">Mini Store Base</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="navItems"
          orientation="vertical"
        />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar>
          <template #title>
            <UDashboardSidebarCollapse />
            Admin Dashboard
          </template>
        </UDashboardNavbar>
      </template>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
