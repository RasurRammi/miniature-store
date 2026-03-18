<script setup lang="ts">
import { useFacets } from '~/composables/admin/useFacets'
import type { Facet, Product } from '~/gql/shop/graphql'
import { useProducts } from '~/composables/useProducts'
import FlexibleGrid from '~/components/common/FlexibleGrid.vue'
import { type FilterMode, useProductFilter } from '~/stores/productFilter'

// TODO remove for production
definePageMeta({
  layout: 'admin-administration',
})

const toast = useToast()

const { resetAll } = useDirtyStateStore()
const productFilter = useProductFilter()
const { data: facetsData } = useFacets()
const { data: productsData } = useProducts()
const facetsCopy = ref<Facet[]>([])
type FilterBadge = {
  facetId: string
  valueId: string
  name: string
}

const productFilterNames = computed(() => {
  const res: { included: FilterBadge[], excluded: FilterBadge[] } = { included: [], excluded: [] }
  if (!facetsData.value?.facets.items) return res

  const facets = facetsData.value.facets.items
  for (const [facetId, values] of productFilter.facetGroups) {
    const facet = facets.find(f => f.id === facetId)
    if (!facet) continue

    for (const [valueId, mode] of values) {
      const facetValue = facet.values.find(v => v.id === valueId)
      if (!facetValue) continue

      const filterBadge = { facetId: facetId, valueId: valueId, name: `${facet.name}: ${facetValue.name}` }
      mode === 'include' ? res.included.push(filterBadge) : res.excluded.push(filterBadge)
    }
  }

  return res
})
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

watch(
  () => facetsData.value?.facets.items,
  (items) => {
    if (items) facetsCopy.value = structuredClone(toRaw(items))
  },
  { immediate: true },
)

function submitChanges() {
  console.log('submit:', facetsCopy.value)
  // TODO reload
  toast.add({
    title: 'All changes were successfully saved',
    color: 'success',
  })
}

function resetChanges() {
  resetAll()
  facetsCopy.value = facetsData.value
    ? structuredClone(toRaw(facetsData.value?.facets.items))
    : []
  toast.add({
    title: 'All changes were discarded',
    color: 'success',
  })
}
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-2">
    <div class="w-full lg:w-1/3 p-2 rounded-lg bg-elevated/25">
      <h2 class="text-xl text-highlighted text-center p-2">
        Tag Groups
      </h2>
      <FacetsTable
        v-model="facetsCopy"
      />
    </div>

    <div class="w-full lg:w-2/3 p-2 rounded-lg bg-elevated/25">
      <h2 class="text-xl text-highlighted text-center p-2">
        Products
      </h2>
      <div class="flex flex-col p-2 gap-2 rounded-lg bg-elevated/50">
        <div class="flex flex-row gap-2 items-center">
          <UIcon
            name="i-lucide-filter"
            class="ml-1 my-1.5"
          />
          <UBadge
            v-for="filterBadge in productFilterNames.included"
            :key="filterBadge.facetId + '-' + filterBadge.valueId"
            color="success"
            variant="outline"
            size="lg"
          >
            {{ filterBadge.name }}
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="neutral"
              size="sm"
              class="p-0"
              @click="productFilter.removeFacetValue(filterBadge.facetId, filterBadge.valueId)"
            />
          </UBadge>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <UIcon
            name="i-lucide-filter-x"
            class="ml-1 my-1.5"
          />
          <UBadge
            v-for="filterBadge in productFilterNames.excluded"
            :key="filterBadge.facetId + '-' + filterBadge.valueId"
            :label="name"
            color="error"
            variant="outline"
            size="lg"
          >
            {{ filterBadge.name }}
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="neutral"
              size="sm"
              class="p-0"
              @click="productFilter.removeFacetValue(filterBadge.facetId, filterBadge.valueId)"
            />
          </UBadge>
        </div>
      </div>

      <div class="mt-2 p-2 rounded-lg bg-elevated/50">
        <FlexibleGrid
          v-if="filteredProducts.length"
          :items="filteredProducts"
        >
          <template #default="{ item }">
            <img
              :src="item.featuredAsset.preview"
              class="bg-muted"
            >
          </template>
        </FlexibleGrid>
      </div>
    </div>

    <FloatingBar
      @save="submitChanges()"
      @discard="resetChanges()"
    />
  </div>
</template>

<style scoped>

</style>
