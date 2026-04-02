import type { Product } from '~/types/fragmentAliases'

export const useAssetSelectionDrawerStore = defineStore('assetSelectionDrawer', () => {
  const { isOpen, data: product, updateData, open, close, onAfterLeave } = useDrawerState<Product>()
  return { isOpen, product, updateData, open, close, onAfterLeave }
})
