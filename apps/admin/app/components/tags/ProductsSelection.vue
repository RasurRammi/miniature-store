<script setup lang="ts">
import type { Product } from '~/types/fragmentAliases'
import {SelectionGrid} from "@miniature-store/shared/components";

const selectedIds = defineModel<string[]>({required: true})
const { products, disabled } = defineProps<{ products: Product[], disabled: boolean }>()

const emit = defineEmits<{
  productsSelected: [string[]]
}>()
</script>

<template>
  <SelectionGrid
    v-model="selectedIds"
    :items="products"
    :size="6"
    :disabled="disabled"
    @update:model-value="(ids: string[]) => emit('productsSelected', ids)"
  >
    <template #default="{ item }: {item: Product}">
      <img
        :src="item.featuredAsset?.preview"
        :alt="item.name"
        class="bg-muted"
        loading="lazy"
      >
    </template>
    <template #empty>
      <UEmpty
        title="No Products matching the currents filters"
      />
    </template>
  </SelectionGrid>
</template>

<style scoped>

</style>
