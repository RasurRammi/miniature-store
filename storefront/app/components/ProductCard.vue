<script setup lang="ts">
import { useProductDrawerStore } from '~/stores/productDrawer'
import { formatCurrency } from '~/utils/formatCurrency'
import type { ProductVariant } from '~/gql/shop/graphql'
import GridCard from '~/components/common/GridCard.vue'

const { productV } = defineProps<{ productV: ProductVariant }>()

const productDrawer = useProductDrawerStore()
</script>

<template>
  <GridCard>
    <button
      class="aspect-square w-full bg-muted cursor-pointer block"
      @click="productDrawer.open(productV)"
    >
      <img
        v-if="productV.product.featuredAsset?.preview"
        :src="productV.product.featuredAsset.preview"
        :alt="productV.name"
        class="w-full h-full object-cover"
      >
      <span
        v-else
        class="w-full h-full flex items-center justify-center"
      >
        <UIcon
          name="i-lucide-image"
          class="size-16 text-muted"
        />
      </span>
    </button>

    <template #footer>
      <UButton
        variant="link"
        color="neutral"
        class="cursor-pointer p-0 text-lg font-semibold"
        @click="productDrawer.open(productV)"
      >
        {{ productV.name }}
      </UButton>

      <div class="flex flex-row justify-between items-center">
        <div v-if="productV.price > 0">
          {{ formatCurrency(productV.price) }} {{ productV.currencyCode === 'EUR' ? '€' : '?' }}
        </div>
        <div
          v-else
          class="text-primary"
        >
          Free
        </div>
        <div class="flex flex-row gap-1">
          <UButton icon="i-lucide-shopping-basket" />
        </div>
      </div>
    </template>
  </GridCard>
</template>

<style scoped>

</style>
