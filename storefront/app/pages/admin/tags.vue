<script setup lang="ts">
import type { Product } from '~/gql/admin/graphql'
import { useProducts } from '~/composables/useProducts'
import { type FilterMode, useProductFilter } from '~/stores/productFilter'
import SelectionGrid from '~/components/common/SelectionGrid.vue'
import FilteredSearch from '~/components/common/FilteredSearch.vue'
import type { ValueGroup } from '~/types/filteredSearch'
import { useFacets } from '~/composables/admin/useFacets'

// TODO remove for production
definePageMeta({
  layout: 'admin',
})

const productFilter = useProductFilter()
const { data: facetsData } = useFacets()
const { data: productsData } = useProducts()
const selectedProducts = ref<string[]>([])

const filteredProducts = computed<Product[]>(() => {
  const items = productsData.value?.products.items ?? []
  if (!productFilter.facetGroups.size) return items

  return items.filter((product: Product) => {
    const productValueIds = new Set(product.facetValues.map(fv => fv.id))

    return productFilter.facetGroups.values().every((values: Map<string, FilterMode>) => {
      const includes: string[] = []
      const excludes: string[] = []

      for (const [id, mode] of values) {
        if (mode === 'include') {
          includes.push(id)
        }
        else {
          excludes.push(id)
        }
      }

      if (excludes.length && excludes.some(id => productValueIds.has(id))) {
        return false
      }
      if (includes.length && !includes.some(id => productValueIds.has(id))) {
        return false
      }
      return true
    })
  })
})

const activeTokens = ref([])

const tagFilters = computed<ValueGroup[]>(() => {
  if (!facetsData.value?.facets.items) return []
  return facetsData.value.facets.items
    .map(f => (
      {
        id: f.id,
        label: f.name,
        values: f.values.map(fV => ({ id: fV.id, label: `${fV.name}` })),
      }
    ))
})
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-2">
    <!-- Facets -->
    <div class="w-full lg:w-1/3 p-2 rounded-lg bg-elevated/25">
      <Facets v-model="facetsCopy" />
    </div>

    <!-- Products -->
    <div class="w-full lg:w-2/3 p-2 rounded-lg bg-elevated/25">
      <h2 class="text-xl text-highlighted text-center p-2">
        Products
      </h2>

      <div class="flex flex-col gap-4">
        <FilteredSearch
          v-model="activeTokens"
          :categories="[
            {
              id: 'tags',
              label: 'Tag',
              icon: 'i-lucide-tag',
              valueGroups: tagFilters,
            },
            {
              id: 'releases',
              label: 'Releases',
              icon: 'i-lucide-package-2',
              valueGroups: [
                { id: '1', label: '', values: [{ id: '1', label: 'Feb 2026' }, { id: '2', label: 'Jan 2026' }] },
                { id: '2', label: '2025', values: [{ id: '3', label: 'Dec 2025' }, { id: '4', label: 'Nov 2025' }] },
              ],
            },
            {
              id: 'collection',
              label: 'Collection',
              icon: 'i-lucide-book-copy',
              valueGroups: [
                { id: '1', label: 'Dragons', values: [{ id: '1', label: 'Red Dragons' }, { id: '2', label: 'Blue Dragons' }] },
                { id: '2', label: 'Animals', values: [{ id: '3', label: 'Mice' }, { id: '4', label: 'Rabbits' }] },
              ],
            },
          ]"
        />

        <!-- Product Selection -->
        <div class="p-2 rounded-lg bg-elevated/50">
          <SelectionGrid
            v-model="selectedProducts"
            :items="filteredProducts"
            :size="6"
          >
            <template #default="{ item }">
              <img
                :src="item.featuredAsset.preview"
                class="bg-muted"
              >
            </template>
            <template #empty>
              <UEmpty
                title="No Products matching the currents filters"
              />
            </template>
          </SelectionGrid>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
