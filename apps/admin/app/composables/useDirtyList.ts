// composables/useDirtyList.ts
import type { Facet, FacetValue } from '~/gql/admin/graphql'

export function getFacetId(facet: Facet) {
  return `Facet:${facet.id}`
}
export function getValueId(facetV: FacetValue) {
  return `Facet:${facetV.facetId}-Value:${facetV.id}`
}

export function useDirtyList<T extends Facet | FacetValue>(
  items: Ref<T[]>,
  getKey: (item: T) => string,
) {
  const { addToList, removeFromList, getValueMeta, updateValue, getColorChip, deleteValue, restoreValue } = useDirtyStateStore()

  watch(items, (newItems, oldItems) => {
    oldItems?.forEach(item => removeFromList(getKey(item)))
    newItems.forEach(item => addToList(getKey(item), {
      original: item.name,
      model: item.name,
      isNew: false,
      isDeleted: false,
    }))
  }, { immediate: true })

  function addItem(item: T) {
    items.value.push(item)
    addToList(getKey(item), {
      original: item.name,
      model: item.name,
      isNew: true,
      isDeleted: false,
    })
  }

  let counter = 0
  function addNewItem(overrides: Partial<T> & { name: string }) {
    addItem(createDraftItem(overrides))
  }
  function createDraftItem(overrides: Partial<T> & { name: string }): T {
    return { id: `new-${counter++}`, code: '', ...overrides } as T
  }

  function deleteItem(item: T, onHardDelete?: () => void) {
    if (item.id.startsWith('new-')) {
      items.value = items.value.filter(i => i.id !== item.id)
      removeFromList(getKey(item))
      onHardDelete?.()
    }
    else {
      deleteValue(getKey(item))
    }
  }

  return {
    addItem,
    addNewItem,
    updateItem: (item: T, val: string) => updateValue(getKey(item), val),
    updateValue,
    restoreItem: (item: T) => restoreValue(getKey(item)),
    restoreValue,
    deleteItem,
    deleteValue,
    getValueMeta,
    getMeta: (item: T) => getValueMeta(getKey(item)),
    getChipColor: (item: T) => getColorChip(getKey(item)),
  }
}
