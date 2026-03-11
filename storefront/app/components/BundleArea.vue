<script setup lang="ts">
import { useProductDrawerStore } from '~/stores/productDrawer'
import type { Collection } from '~/gql/shop/graphql'

const productDrawer = useProductDrawerStore()

const { bundle } = defineProps<{ bundle: Collection }>()
const isOpen = ref(true)
</script>

<template>
  <UCollapsible
    v-model:open="isOpen"
    class="border border-default rounded-xl"
  >
    <div
      class="flex items-center p-4 cursor-pointer bg-muted transition-colors rounded-xl gap-2"
    >
      <UIcon
        :name="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        class="size-6"
      />
      <span class="font-bold">{{ bundle.name }}</span>
    </div>

    <template #content>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-4">
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
      </div>
    </template>
  </UCollapsible>
</template>

<style scoped>

</style>
