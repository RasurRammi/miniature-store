<script setup lang="ts">
import SelectionGrid from '~/components/common/SelectionGrid.vue'
import { useProducts } from '~/composables/useProducts'
import type { FilterToken } from '~/types/filteredSearch'
import { filterProducts } from '~/composables/admin/useFilterProducts'

const { data: productsData } = useProducts()
const { filterTokens } = defineProps<{ filterTokens: FilterToken[] }>()
const selectedProducts = ref<string[]>([])

const filteredProducts = computed(() => filterProducts(productsData.value?.products.items ?? [], filterTokens))
</script>

<template>
  <SelectionGrid
    v-model="selectedProducts"
    :items="filteredProducts"
    :size="6"
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
