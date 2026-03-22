<script setup lang="ts">
const headerLogo = '/nomnom-logo.png'
const logoAlt = 'NomNom Miniatures'

const navItems = [
  [

    {
      label: 'Dashboard',
      icon: 'i-lucide-layout-dashboard',
      to: '/admin/dashboard',
    },
    {
      label: 'Catalogue',
      icon: 'i-lucide-book-open',
      to: '/admin/releases',
      open: true,
      children: [
        {
          label: 'Releases',
          icon: 'i-lucide-package-2',
          to: '/admin/releases',
        },
        {
          label: 'Products',
          icon: 'i-lucide-book',
          to: '/admin/products',
        },
        {
          label: 'Collections',
          icon: 'i-lucide-book-copy',
          to: '/admin/collections',
        },
        {
          label: 'Tags',
          icon: 'i-lucide-tag',
          to: '/admin/tags',
        },
        {
          label: 'Assets',
          icon: 'i-lucide-image',
          to: '/admin/assets',
        },
      ],
    },
    {
      label: 'Users',
      to: '/admin/insights',
      icon: 'i-lucide-users',
      open: true,
      children: [
        {
          label: 'Insights',
          icon: 'i-lucide-chart-area',
          to: '/admin/insights',
        },
        {
          label: 'Customers',
          icon: 'i-lucide-user',
          to: '/admin/customers',
        },
        {
          label: 'Orders',
          icon: 'i-lucide-shopping-bag',
          to: '/admin/orders',
        },
      ],
    },
    {
      label: 'Configuration',
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
