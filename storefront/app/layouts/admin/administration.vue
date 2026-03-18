<script setup lang="ts">
import { useAdministrationNav } from '~/composables/useNavItems'

const navItems = useAdministrationNav()
</script>

<template>
  <NuxtLayout name="default">
    <UContainer>
      <div class="flex flex-row">
        <div class="hidden lg:block lg:w-1/6">
          <h2 class="text-bold text-lg m-2">
            Navigation
          </h2>
          <UNavigationMenu
            :items="navItems"
            :orientation="'vertical'"
          />
        </div>

        <div class="w-full lg:w-5/6 m-2">
          <slot />
        </div>
      </div>
    </UContainer>
  </NuxtLayout>
</template>
