<script setup lang="ts">
import {useProductDrawerStore} from '~/stores/productDrawer'
import type {ProductVariant} from '~/types/fragmentAliases'
import {useRootReleaseBundle} from '~/composables/useRootReleaseBundle'
import {DrawerLayout, ImageCarousel} from "@miniature-store/shared/components";

const productDrawer = useProductDrawerStore()

const { productV } = defineProps<{
  productV: ProductVariant
}>()

const { data: rootReleaseCol } = await useRootReleaseBundle()
const selectedRelease = computed(() => productV?.product.collections.find(c => c.parentId === rootReleaseCol.value?.id))

</script>

<template>
  <DrawerLayout @close="productDrawer.close">
    <template #title>
      <span>
        {{ productV.product.name }}
      </span>
    </template>
    <template #actions>
      <UButton
        icon="i-lucide-expand"
        :to="`/store/product/${productV.product.id}`"
        color="neutral"
        variant="ghost"
        class="cursor-pointer"
      />
    </template>
    <template #header>

      <!-- Tags -->
      <div class="flex gap-1">
        <UBadge
          v-if="selectedRelease"
          :label="selectedRelease.name"
          variant="subtle"
          color="primary"
          size="lg"
        />
        <UBadge
          v-for="tag in productV?.product.facetValues"
          :key="tag.id"
          :label="tag.name"
          variant="subtle"
          color="neutral"
          size="lg"
        />
      </div>
    </template>

    <ImageCarousel
      :images="productV?.product.assets ?? []"
    />

    <!-- Description -->
    <p
      v-if="productV.product.description"
      class="text-muted bg-elevated rounded-md p-2"
    >
      {{ productV.product.description }}
    </p>

    <!-- Buttons -->
    <div class="flex flex-row-reverse gap-2">
      <UButton
        label="Add to Cart"
        icon="i-lucide-shopping-basket"
        size="xl"
      />
      <UButton
        label="Download"
        icon="i-lucide-download"
        size="xl"
      />
    </div>
  </DrawerLayout>
</template>

<style scoped>

</style>
