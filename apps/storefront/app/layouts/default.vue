<script setup lang="ts">

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: 'favicon.ico' },
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
      :logo-alt="'Test'"
      :header-logo="'test'"
    />

    <UMain>
      <slot />
    </UMain>

    <USeparator
      :avatar="{
        src: 'test',
        loading: 'lazy',
      }"
    />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built for great creators • © {{ new Date().getFullYear() }}
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
