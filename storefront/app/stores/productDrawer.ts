import type { ProductVariant } from '~/gql/shop/graphql'

export const useProductDrawerStore = defineStore('productDrawer', () => {
  const { isOpen, data: productV, open, close, onAfterLeave } = useDrawerState<ProductVariant>()
  return { isOpen, productV, open, close, onAfterLeave }
})
