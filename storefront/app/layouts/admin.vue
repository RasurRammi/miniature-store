<script setup lang="ts">
const headerLogo = '/nomnom-logo.png'
const logoAlt = 'NomNom Miniatures'

const route = useRoute()

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
      type: 'trigger',
      defaultOpen: route.path.startsWith('/admin/catalogue'),
      children: [
        {
          label: 'Products',
          icon: 'i-lucide-book',
          to: '/admin/catalogue/products',
        },
        {
          label: 'Releases',
          icon: 'i-lucide-package-2',
          to: '/admin/catalogue/releases',
        },
        {
          label: 'Collections',
          icon: 'i-lucide-book-copy',
          to: '/admin/catalogue/collections',
        },
        {
          label: 'Tags',
          icon: 'i-lucide-tag',
          to: '/admin/catalogue/tags',
        },
        {
          label: 'Assets',
          icon: 'i-lucide-image',
          to: '/admin/catalogue/assets',
        },
      ],
    },
    {
      label: 'Subscription',
      icon: 'i-lucide-calendar-sync',
      to: '/admin/subscriptions',
    },
    {
      label: 'Users',
      type: 'trigger',
      icon: 'i-lucide-users',
      defaultOpen: route.path.startsWith('/admin/users'),
      children: [
        {
          label: 'Insights',
          icon: 'i-lucide-chart-area',
          to: '/admin/users/insights',
        },
        {
          label: 'Customers',
          icon: 'i-lucide-user',
          to: '/admin/users/customers',
        },
        {
          label: 'Orders',
          icon: 'i-lucide-shopping-bag',
          to: '/admin/users/orders',
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
