<script setup lang="ts">
import type { Collection } from '~/gql/shop/graphql'
import GridArea from '~/components/common/GridArea.vue'

const { bundle } = defineProps<{ bundle: Collection }>()
</script>

<template>
  <GridArea
    :title="bundle.name"
    :collapsible="true"
    :initial-state="true"
  >
    <template #actions>
      <UButton
        variant="solid"
        color="primary"
        icon="i-lucide-plus"
        label="Add Product"
        size="lg"
      />
    </template>
    <ProductCard
      v-for="productV in bundle.productVariants.items"
      :key="productV.id"
      :product-v="productV"
    />
  </GridArea>
</template>

<style scoped>

</style>
