import type { Product } from '~/types/fragmentAliases'
import {useDrawerState} from "@miniature-store/shared/stores";

export const useAssetSelectionDrawerStore = defineStore('assetSelectionDrawer', () => {
  const { isOpen, data: product, updateData, open, close, onAfterLeave } = useDrawerState<Product>()
  return { isOpen, product, updateData, open, close, onAfterLeave }
})
