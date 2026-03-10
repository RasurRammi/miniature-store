<script setup lang="ts">
import {useProductDrawerStore} from "~/stores/productDrawer";
import {formatCurrency} from "~/utils/formatCurrency";
import type {ProductVariant} from "~/gql/shop/graphql";

const {productV} = defineProps<{ productV: ProductVariant }>();

const productDrawer = useProductDrawerStore()

</script>

<template>
  <UCard :variant="'subtle'" :ui="{root: '', body: 'p-0 sm:p-0', footer: 'p-2 sm:px-2'}">

    <button
      @click="productDrawer.open(productV)"
      class="aspect-square w-full bg-muted cursor-pointer block">
      <img
        v-if="productV.product.featuredAsset?.preview"
        :src="productV.product.featuredAsset.preview"
        :alt="productV.name"
        class="w-full h-full object-cover"
      />
      <span v-else class="w-full h-full flex items-center justify-center">
        <UIcon name="i-lucide-image" class="size-16 text-muted"/>
      </span>
    </button>

    <template #footer>
      <div class="flex flex-col gap-2">
        <UButton
          variant="link"
          color="neutral"
          @click="productDrawer.open(productV)"
          class="cursor-pointer p-0 text-lg font-semibold">
          {{ productV.name }}
        </UButton>

        <div class="flex flex-row justify-between items-center">
          <div>
            {{ formatCurrency(productV.price) }} {{productV.currencyCode === 'EUR' ? '€' : '?'}}
          </div>
          <div class="flex flex-row gap-1">
            <UButton icon="i-lucide-shopping-basket"/>
          </div>
        </div>
      </div>
    </template>
  </UCard>
</template>

<style scoped>

</style>
