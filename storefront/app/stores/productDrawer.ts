import type { ProductVariant } from '~/types/fragmentAliases'

export const useProductDrawerStore = defineStore('productDrawer', () => {
  const { isOpen, data: productV, open, close, onAfterLeave } = useDrawerState<ProductVariant>()
  return { isOpen, productV, open, close, onAfterLeave }
})
