<script setup lang="ts">
import Facets from '~/components/tags/Facets.vue'
import DefaultFilteredSearch from '~/components/filteredSearch/DefaultFilteredSearch.vue'
import type { FacetValue, Product } from '~/types/fragmentAliases'
import { useSubmitProductTags } from '~/composables/admin/useSubmitProductTags'

// TODO remove for production
definePageMeta({
  layout: 'admin',
})

const isEditingFacets = ref<boolean>(false)
// --- Products ---
const { data: productsData } = useProducts()
const allProducts = ref<Product[]>([])
watch(
  productsData,
  () => allProducts.value = structuredClone(toRaw(productsData.value?.products.items ?? [])),
  { immediate: true },
)
const selectedProductIds = ref<string[]>([])
const selectedProducts = computed(() => {
  if (!selectedProductIds.value) return []
  return selectedProductIds.value
    .map(id => allProducts.value.find(p => p.id === id)!)
})

// --- FacetValues ---
export type SelectionStateMap = Map<string, 'some' | 'every'>
const selectedFacetValueIds = computed<SelectionStateMap>(() => {
  const valueMap = new Map()
  if (!selectedProductIds.value) return valueMap
  const ids = selectedProducts.value.flatMap((product: Product) => product.facetValues.map(fV => fV.id))
  const uniqIds = [...new Set(ids)]
  uniqIds.forEach((id) => {
    valueMap.set(
      id,
      selectedProducts.value.every(p => p.facetValues.map(fV => fV.id).includes(id))
        ? 'every'
        : 'some',
    )
  })
  return valueMap
})
const anyProductSelected = computed(() => !!selectedProductIds.value?.length)

function toggleValueState(facetValue: FacetValue, oldState: 'none' | 'some' | 'every') {
  if (!selectedProductIds.value) return
  if (oldState === 'none') {
    selectedProducts.value.forEach((sP: Product) => {
      sP.facetValues.push(facetValue)
    })
  }
  else if (oldState === 'every') {
    selectedProducts.value.forEach((sP: Product) => {
      sP.facetValues = sP.facetValues.filter(fV => fV.id !== facetValue.id)
    })
  }
  else if (oldState === 'some') {
    selectedProducts.value.forEach((sP: Product) => {
      const hasFacet = sP.facetValues.find(fV => fV.id === facetValue.id)
      if (!hasFacet) {
        sP.facetValues.push(facetValue)
      }
    })
  }
}

const changedProducts = computed(() => {
  if (!productsData.value) return []
  return allProducts.value.filter((product) => {
    const ogProduct = productsData.value.products.items.find(p => p.id === product.id)!
    const ids = product.facetValues.map(fV => fV.id).sort().join(',')
    const ogIds = ogProduct.facetValues.map(fV => fV.id).sort().join(',')
    return ids !== ogIds
  })
})
function resetProductChanges() {
  allProducts.value = structuredClone(toRaw(productsData.value?.products.items ?? []))
}

const toast = useToast()
const submitProductTags = useSubmitProductTags()
function submitProductChanges() {
  const productInputs = changedProducts.value.map((product: Product) => ({
    productId: product.id,
    tagIds: product.facetValues.map(fV => fV.id),
  }))
  const count = productInputs.length
  submitProductTags.mutate(productInputs, {
    onSuccess: () => {
      toast.add({
        title: `${count} Products successfully updated`,
        icon: 'i-lucide-check',
        color: 'success',
      })
    },
    onError: (err) => {
      console.log(err)
      toast.add({
        title: 'An error occurred when trying to update the products',
        description: err.name + ': ' + err.message,
        icon: 'i-lucide-x',
        color: 'error',
      })
    },
  })
}

export type ProductSelectionContext = {
  selectedValueIds: Ref<SelectionStateMap>
  anySelected: Ref<boolean>
  toggleValueState: (facetValue: FacetValue, oldState: 'none' | 'some' | 'every') => void
}
provide('productSelection', {
  selectedValueIds: selectedFacetValueIds,
  anySelected: anyProductSelected,
  toggleValueState: toggleValueState,
} satisfies ProductSelectionContext)
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-2">
    <!-- Facets -->
    <div class="w-full lg:w-1/3 p-2 rounded-lg bg-elevated/25">
      <Facets v-model="isEditingFacets" />
    </div>

    <!-- Products -->
    <div class="w-full lg:w-2/3 p-2 rounded-lg bg-elevated/25">
      <h2 class="text-xl text-highlighted text-center p-2">
        Products
      </h2>

      <DefaultFilteredSearch
        v-model="selectedProductIds"
        :all-products="allProducts"
        :starting-tokens="[]"
        :selection-disabled="isEditingFacets"
      />
    </div>

    <FloatingBar
      :total-changes="changedProducts.length"
      :change-text="'Products changed'"
      @save="submitProductChanges()"
      @discard="resetProductChanges()"
    />
  </div>
</template>

<style scoped>

</style>
