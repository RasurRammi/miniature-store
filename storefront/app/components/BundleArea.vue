<script setup lang="ts">
import { useProductDrawerStore } from '~/stores/productDrawer'
import type { Collection } from '~/gql/shop/graphql'
import GridArea from '~/components/common/GridArea.vue'

const productDrawer = useProductDrawerStore()

const { bundle } = defineProps<{ bundle: Collection }>()
</script>

<template>
  <GridArea
    :title="bundle.name"
    :collapsible="true"
    :initial-state="true"
  >
    <ProductCard
      v-for="productV in bundle.productVariants.items"
      :key="productV.id"
      :product-v="productV"
    />

    <UCard
      variant="outline"
      :ui="{ root: '', body: 'p-0 sm:p-0', footer: 'p-2 sm:px-2' }"
    >
      <button
        class="aspect-square w-full cursor-pointer block"
        @click="productDrawer.open()"
      >
        <span class="w-full h-full flex items-center justify-center">
          <UIcon
            name="i-lucide-plus"
            class="size-16 text-muted"
          />
        </span>
      </button>

      <template #footer>
        <div class="flex flex-col items-center gap-2">
          <UButton
            variant="link"
            color="neutral"
            class="cursor-pointer p-0 text-lg font-semibold"
            @click="productDrawer.open()"
          >
            Add a new Product
          </UButton>
        </div>
      </template>
    </UCard>
  </GridArea>
</template>

<style scoped>

</style>
