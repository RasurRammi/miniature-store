<script setup lang="ts">
import { useTheme } from '~/composables/admin/useTheme'

const { themeData } = useTheme()

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

const title = 'Miniature Store Base'
const description = 'A website base to for 3D-Miniature creators to host their own website'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <HeaderBar
      :header-logo="themeData.logoSrc"
      :logo-alt="themeData.logoTitle"
    />

    <UMain>
      <slot />
    </UMain>

    <USeparator
      :avatar="{
        src: themeData.logoSrc,
        loading: 'lazy',
      }"
    />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with for great creators • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/RasurRammi/miniature-store"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </div>
</template>

<style lang="scss" scoped>

</style>
