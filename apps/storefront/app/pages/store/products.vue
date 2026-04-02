<script setup lang="ts">
import BundleArea from '~/components/BundleArea.vue'
import { useBundles } from '~/composables/useBundles'
import type { Collection, Product, ProductVariant } from '~/types/fragmentAliases'
import type { TokenData } from '~/types/filteredSearch'

const { data: bundleData, isLoading, error } = useBundles()

const { data: productsData } = useProducts()
const allProducts = ref<Product[]>([])
const filterTokens = ref<TokenData<any>[]>([])

const searchTerm = ref('')
const filteredReleases = computed(() => {
  if (!bundleData.value) return []
  if (!searchTerm.value) return bundleData.value.collections.items

  const query = searchTerm.value.toLowerCase()

  return bundleData.value.collections.items
    .map((bundle: Collection) => {
      const bundleMatches = bundle.name.toLowerCase().includes(query)
      let productVariants = bundle.productVariants.items
      if (!bundleMatches) {
        productVariants = bundle.productVariants.items.filter((productV: ProductVariant) =>
          productV.name.toLowerCase().includes(query),
        )
      }
      return {
        ...bundle,
        productVariants: { items: productVariants },
      }
    })
    .filter((bundle: Collection) =>
      bundle.name.toLowerCase().includes(query)
      || bundle.productVariants.items.length > 0,
    )
})
</script>

<template>
  <div>
    <div class="w-full h-80 bg-muted mb-10">
      <img alt="Product Banner">
    </div>

    <UContainer>
      <div class="flex flex-col gap-2">
        <!-- Searchbar --->
        <div class="mx-8 mb-4">
          <UInput
            v-model="searchTerm"
            trailing-icon="i-lucide-search"
            placeholder="Search..."
            size="xl"
            class="w-full"
          />
        </div>

        <!-- Filter & Products --->
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Filter --->
          <div class="w-full lg:w-72 shrink-0">
            <ProductsFilter
              v-model="filterTokens"
              :products="allProducts"
            />
          </div>

          <!-- Products --->
          <div class="flex-1 flex flex-col gap-4">
            <!-- Products Layout Buttons --->
            <div class="flex flex-row-reverse gap-1">
              <UButton
                icon="i-lucide-grid-2x2"
                color="primary"
                variant="outline"
                size="xl"
                @click="console.log('test')"
              />
              <UButton
                icon="i-lucide-list"
                color="neutral"
                variant="ghost"
                size="xl"
                @click="console.log('test')"
              />
            </div>

            <!-- Products Grid --->
            <div v-if="isLoading">
              <div class="border border-default rounded-xl">
                <USkeleton class="w-full h-14 rounded-xl" />
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-4">
                  <USkeleton class="w-[207.5px] h-[292.5px] rounded-xl" />
                  <USkeleton class="w-[207.5px] h-[292.5px] rounded-xl" />
                  <USkeleton class="w-[207.5px] h-[292.5px] rounded-xl" />
                  <USkeleton class="w-[207.5px] h-[292.5px] rounded-xl" />
                  <USkeleton class="w-[207.5px] h-[292.5px] rounded-xl" />
                  <USkeleton class="w-[207.5px] h-[292.5px] rounded-xl" />
                  <USkeleton class="w-[207.5px] h-[292.5px] rounded-xl" />
                  <USkeleton class="w-[207.5px] h-[292.5px] rounded-xl" />
                </div>
              </div>
            </div>

            <BundleArea
              v-for="release in filteredReleases"
              v-else-if="filteredReleases.length"
              :key="release.id"
              :release="release"
            />

            <template v-else>
              <UEmpty title="No products found" />
            </template>
          </div>
        </div>
      </div>
    </UContainer>

    <ProductSlideover />
  </div>
</template>

<style scoped>

</style>
