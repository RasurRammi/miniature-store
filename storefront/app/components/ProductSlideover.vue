<script setup lang="ts">
import { useProductDrawerStore } from '~/stores/productDrawer'
import { useAdminUser } from '~/composables/admin/useAdminUser'

const productDrawer = useProductDrawerStore()
const { data: adminUser } = await useAdminUser()
</script>

<template>
  <USlideover
    v-model:open="productDrawer.isOpen"
    :title="productDrawer.productV?.product.name ?? ''"
    :description="productDrawer.productV?.product.description ?? ''"
    :ui="{ content: 'max-w-full sm:max-w-lg md:max-w-xl lg:max-w-1/2 xl:max-w-1/3' }"
    :modal="false"
    @after:leave="productDrawer.onAfterLeave"
  >
    <template #content>
      <ProductInfo
        v-if="productDrawer.productV"
        :product-v="productDrawer.productV"
        :can-edit="true"
      />
      <ProductInfo
        v-else
        :product-v="productDrawer.productV"
        :can-edit="!!adminUser"
      />
    </template>
  </USlideover>
</template>

<style scoped>

</style>
