import type { ProductVariant } from '~/types/fragmentAliases'
import {useDrawerState} from "@miniature-store/shared/stores";

export const useProductDrawerStore = defineStore('productDrawer', () => {
  const { isOpen, data: productV, updateData, open, close, onAfterLeave } = useDrawerState<ProductVariant>()
  return { isOpen, productV, updateData, open, close, onAfterLeave }
})
