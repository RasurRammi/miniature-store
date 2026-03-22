import type { Product } from '~/types/fragmentAliases'

export const useAssetSelectionDrawerStore = defineStore('assetSelectionDrawer', () => {
  const { isOpen, data: product, open, close, onAfterLeave } = useDrawerState<Product>()
  return { isOpen, product, open, close, onAfterLeave }
})
