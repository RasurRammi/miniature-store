<script setup lang="ts">
import { useProduct } from '~/composables/useProduct'

const route = useRoute()
const { data } = useProduct(route.params.id)
</script>

<template>
  <UContainer>
    <ProductInfo
      v-if="data?.product?.variants?.length > 0"
      :product-v="data?.product?.variants[0]"
      :can-edit="true"
    />
    <ProductInfo
      v-else
      :product-v="null"
      :can-edit="!!adminUser"
    />
  </UContainer>
</template>

<style scoped>

</style>
