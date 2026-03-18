export type FilterMode = 'include' | 'exclude'

export const useProductFilter = defineStore('productFilter', () => {
  // FacetId -> FacetValueId -> Include/Exclude
  const facetGroups = reactive<Map<string, Map<string, FilterMode>>>(new Map())

  function addFacetValue(facetId: string, valueId: string, mode: FilterMode = 'include') {
    if (!facetGroups.has(facetId)) {
      facetGroups.set(facetId, new Map())
    }
    facetGroups.get(facetId)!.set(valueId, mode)
  }

  function removeFacetValue(facetId: string, valueId: string) {
    const facetGroup = facetGroups.get(facetId)
    if (!facetGroup) return
    facetGroup.delete(valueId)
    if (facetGroup.size === 0) facetGroups.delete(facetId)
  }

  function resetFilters() {
    facetGroups.clear()
  }

  return { facetGroups, addFacetValue, removeFacetValue, resetFilters }
})
