<script setup lang="ts">
const headerLogo = '/nomnom-logo.png'
const logoAlt = 'NomNom Miniatures'
useHead({
  meta: [
    {name: 'viewport', content: 'width=device-width, initial-scale=1'}
  ],
  link: [
    {rel: 'icon', href: headerLogo}
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Miniature Store Base'
const description = 'A website base to for 3D-Miniature creators to host their own website'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <HeaderBar :headerLogo="headerLogo" :logoAlt="logoAlt"/>

  <UMain>
    <UContainer>
      <slot/>
    </UContainer>
  </UMain>

  <USeparator icon="i-simple-icons-nuxtdotjs"/>

  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        Built with Nuxt UI • © {{ new Date().getFullYear() }}
      </p>
    </template>

    <template #right>
      <UButton
        to="https://github.com/nuxt-ui-templates/starter"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>

<style lang="scss" scoped>

</style>
