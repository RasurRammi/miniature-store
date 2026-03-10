import { defineStore } from 'pinia'
import type { ProductVariant } from '~/types/product'

export const useProductDrawerStore = defineStore('productDrawer', () => {
  const isOpen = ref(false)
  const productV = ref<ProductVariant | null>(null)

  function open(payload?: ProductVariant) {
    productV.value = payload ?? null
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    productV.value = null
  }

  return { isOpen, productV, open, close }
})
