<script setup lang="ts">
import type { FilterValue, TokenData, ValueGroup } from '~/types/filteredSearch'
import FilteredSearch2 from '~/components/filteredSearch/FilteredSearch2.vue'
import type { Product } from '~/types/fragmentAliases'
import { useFacets } from '~/composables/useFacets'
import ProductsSelection from '~/components/tags/ProductsSelection.vue'
import { filterProducts } from '~/composables/useFilterProducts'

const selectedProductIds = defineModel<string[]>({ required: true })
const { startingTokens = [], allProducts, selectionDisabled = false } = defineProps<{
  startingTokens?: TokenData<any>[]
  allProducts: Product[]
  selectionDisabled?: boolean
}>()
const activeSearchTokens = ref<TokenData<any>[]>(startingTokens)

const { data: rootReleaseCol } = useRootReleaseBundle()
const { data: facetsData } = useFacets()
const { data: releasesData } = useBundles()

// --- Filter ---
const groupedTags = computed<ValueGroup[]>(() => {
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
const releases = computed<FilterValue[]>(() => {
  if (!releasesData.value?.collections.items) return []
  return releasesData.value.collections.items
    .map(c => (
      {
        id: c.id,
        label: c.name,
      }
    ))
})
const getReleasesFilterStrategy = createOperatorValueStrategy(
  'releases',
  'Release',
  'i-lucide-package-2',
  (item: Product) => {
    if (!rootReleaseCol.value) {
      throw new Error(' Release Collection hasnt been set up, run the npm seed script!')
    }
    return item.collections.filter(c => c.parentId === rootReleaseCol.value!.id)
  },
)
const strategies = [
  getFacetFilterStrategy(() => groupedTags.value),
  getReleasesFilterStrategy(() => releases.value),
]

// --- Products
const filteredProducts = computed(() => {
  if (!allProducts) return []
  return filterProducts(allProducts, activeSearchTokens.value, strategies)
})
function updateSelectedProducts(productIds: string[]) {
  selectedProductIds.value = productIds
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <FilteredSearch2
      v-model="activeSearchTokens"
      :filter-strategies="strategies"
    />
    <!-- Product Selection -->
    <div class="p-2 rounded-lg bg-elevated/50">
      <ProductsSelection
        v-model="selectedProductIds"
        :products="filteredProducts"
        :disabled="selectionDisabled"
        @products-selected="updateSelectedProducts"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
