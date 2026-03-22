<script setup lang="ts">
import FilteredSearch from '~/components/filteredSearch/FilteredSearch.vue'
import type { FilterCategory, FilterToken, ValueGroup } from '~/types/filteredSearch'
import { useFacets } from '~/composables/admin/useFacets'
import ProductsSelection from '~/components/tags/ProductsSelection.vue'
import Facets from '~/components/tags/Facets.vue'

// TODO remove for production
definePageMeta({
  layout: 'admin',
})

const { data: facetsData } = useFacets()

const activeSearchTokens = ref<FilterToken[]>([])
const completedTokens = computed(() =>
  activeSearchTokens.value.filter(t => t.isComplete),
)

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

const filterCategories = computed<FilterCategory[]>(() => [
  {
    id: 'tags',
    label: 'Tag',
    icon: 'i-lucide-tag',
    valueGroups: tagFilters.value,
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
    id: 'collections',
    label: 'Collection',
    icon: 'i-lucide-book-copy',
    valueGroups: [
      { id: '1', label: 'Dragons', values: [{ id: '1', label: 'Red Dragons' }, { id: '2', label: 'Blue Dragons' }] },
      { id: '2', label: 'Animals', values: [{ id: '3', label: 'Mice' }, { id: '4', label: 'Rabbits' }] },
    ],
  },
])
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-2">
    <!-- Facets -->
    <div class="w-full lg:w-1/3 p-2 rounded-lg bg-elevated/25">
      <Facets />
    </div>

    <!-- Products -->
    <div class="w-full lg:w-2/3 p-2 rounded-lg bg-elevated/25">
      <h2 class="text-xl text-highlighted text-center p-2">
        Products
      </h2>

      <div class="flex flex-col gap-4">
        <FilteredSearch
          v-model="activeSearchTokens"
          :categories="filterCategories"
        />

        <!-- Product Selection -->
        <div class="p-2 rounded-lg bg-elevated/50">
          <ProductsSelection :filter-tokens="completedTokens" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
