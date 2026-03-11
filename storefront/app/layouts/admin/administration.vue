<script setup lang="ts">
import type {NavigationMenuItem} from "@nuxt/ui";

const navItems: NavigationMenuItem[] = [
  {
    label: 'Products',
    icon: 'i-lucide-shopping-cart',
    to: '/admin/administration/products',
  },
  {
    label: 'Settings',
    icon: 'i-lucide-cog',
    to: '/admin/administration/settings',
  }
];
</script>
<template>
  <NuxtLayout name="default">
    <div class="flex flex-row">
      <div class="w-1/5">
        <h2 class="text-bold text-lg p-2">Navigation</h2>
        <UNavigationMenu :items="navItems" :orientation="'vertical'"></UNavigationMenu>
      </div>

      <div class="w-4/5">
        <slot/>
      </div>
    </div>
  </NuxtLayout>
</template>
