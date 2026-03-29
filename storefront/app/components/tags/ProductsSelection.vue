<script setup lang="ts">
import SelectionGrid from '~/components/common/SelectionGrid.vue'
import type { Product } from '~/types/fragmentAliases'

const selectedIds = defineModel<string[]>()
const { products } = defineProps<{ products: Product[] }>()

const emit = defineEmits<{
  productsSelected: [string[]]
}>()
</script>

<template>
  <SelectionGrid
    v-model="selectedIds"
    :items="products"
    :size="6"
    @update:model-value="(ids: string[]) => emit('productsSelected', ids)"
  >
    <template #default="{ item }">
      <img
        :src="item.featuredAsset?.preview"
        :aria-label="item.name"
        class="bg-muted"
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
