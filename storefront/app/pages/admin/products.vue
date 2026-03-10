<script setup lang="ts">

import type {NavigationMenuItem} from "@nuxt/ui";
definePageMeta({
  middleware: 'admin'
})

const navItems: NavigationMenuItem[] = [
  {
    label: 'Navigation',
    type: 'label'
  },
  {
    label: 'Products',
    icon: 'i-lucide-shopping-cart',
    to: '/admin/products',
  }
];

const addProductModalIsOpen = ref(false);
async function closeModal() {
  addProductModalIsOpen.value = false;
}
const state = reactive({
  name: '',
  description: '',
  thumbnail: null,
})

async function onSubmit(event) {
  console.log(event.data)
  await $fetch('/api/products', {method: 'POST', body: event.data})
  await closeModal()
}
</script>

<template>
  <UContainer class="flex flex-row">
    <UContainer class="w-80">
      <UNavigationMenu :items="navItems" :orientation="'vertical'"></UNavigationMenu>
    </UContainer>

    <UModal title="Create a Product" v-model:open="addProductModalIsOpen" :dismissible="false">
      <UButton color="neutral" variant="subtle"
               class="w-full h-20 bg-accented m-12 rounded-2xl flex items-center justify-center gap-2 text-2xl">
        <UIcon name="i-lucide-circle-plus" size="size-14"/>
        <p>Add Product</p>
      </UButton>

      <template #body>
        <UForm class="space-y-4" :state="state" @submit="onSubmit">

          <UFormField label="Name" name="name" class="w-3/4">
            <UInput v-model="state.name"/>
          </UFormField>

          <UFormField label="Description" name="description">
            <UTextarea v-model="state.description" class="w-full" />
          </UFormField>

          <UFormField label="Thumbnail" name="thumbnail">
            <UFileUpload
              v-model="state.thumbnail"
              icon="i-lucide-image"
              label="Upload the thumbnail"
              description="SVG, PNG, JPG or GIF"
              class="w-48 h-48"
            />
          </UFormField>

          <UButton type="submit">
            Create
          </UButton>
          <UButton :color="'error'" @click="closeModal">
            Cancel
          </UButton>
        </UForm>
      </template>
    </UModal>
  </UContainer>
</template>

<style scoped>

</style>
