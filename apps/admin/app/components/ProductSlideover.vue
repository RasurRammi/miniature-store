<script setup lang="ts">
import { useProductDrawerStore } from '~/stores/productDrawer'
import type { ProductVariant } from '~/types/fragmentAliases'

const productDrawer = useProductDrawerStore()

const productV = ref<ProductVariant | null>(productDrawer.productV)
watch(() => productDrawer.productV,
  newProdV => productV.value = newProdV,
  { immediate: true },
)
</script>

<template>
  <USlideover
    v-model:open="productDrawer.isOpen"
    :modal="false"
    :ui="{ content: 'max-w-full sm:max-w-lg md:max-w-xl lg:max-w-1/2 xl:max-w-1/3' }"
    @after:leave="productDrawer.onAfterLeave"
  >
    <template #content>
      <ProductInfo
        :key="productV?.id ?? 'new'"
        :product-v="productV ?? undefined"
      />
    </template>
  </USlideover>
</template>

<style scoped>

</style>
