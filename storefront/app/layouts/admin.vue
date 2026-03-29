<script setup lang="ts">
import { type Theme, useTheme } from '~/composables/admin/useTheme'

const { theme, themeData, setTheme } = useTheme()
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: themeData.value.logoSrc },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

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

const themes: { label: string, theme: Theme }[] = [
  { label: 'Default', theme: 'default' },
  { label: 'NomNom', theme: 'nomnom' },
  { label: 'Neko', theme: 'neko' },
]
const footerItems = computed(() => themes
  .map(t => ({
    label: t.label,
    chip: 'primary',
    slot: 'chip',
    checked: theme.value === t.theme,
    type: 'checkbox',
    onSelect: (e) => {
      e.preventDefault()

      setTheme(t.theme)
    },
  })))
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible>
      <template #header="{ collapsed }">
        <div class="flex flex-row items-center gap-2">
          <img
            :src="themeData.logoSrc"
            :alt="themeData.logoTitle"
            :class="{ 'size-7.75': !collapsed }"
          >
          <span v-if="!collapsed">{{ themeData.logoTitle }}</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="navItems"
          orientation="vertical"
        />
      </template>
      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="footerItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
        >
          <UButton
            block
            leading-icon="i-lucide-palette"
            label="Theme Selection"
            color="neutral"
            variant="ghost"
            :square="collapsed"
            class="justify-start data-[state=open]:bg-elevated"
          />
        </UDropdownMenu>
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
