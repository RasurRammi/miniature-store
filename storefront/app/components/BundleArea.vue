<script setup lang="ts">
import type { Collection } from '~/gql/shop/graphql'
import GridArea from '~/components/common/GridArea.vue'
import { useProductDrawerStore } from '#imports'

const productDrawer = useProductDrawerStore()
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
        @click.stop="productDrawer.open()"
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
