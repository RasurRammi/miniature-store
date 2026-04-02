<script setup lang="ts">
import type { TokenData } from '~/types/filteredSearch'
import type { Product } from '~/types/fragmentAliases'
import { useFacets } from '~/composables/admin/useFacets'

const filterTokens = defineModel<TokenData<any>[]>({ required: true })
const { products } = defineProps<{
  products: Product[]
}>()

const { data: facetsData } = useFacets()
const facets = computed(() => facetsData.value?.facets.items ?? [])

const facetLists = computed(() => {
  return facets.value?.map((f) => {
    return {
      facet: f,
      items: f.values.map(fV => ({
        label: fV.name,
        type: 'checkbox',
        onSelect: (e) => {
          e.preventDefault()
          console.log(fV)
        },
      })),
    }
  })
})
</script>

<template>
  <div
    class="flex flex-col gap-2"
  >
    <span class="text-2xl p-2">Filter</span>
    <template
      v-for="facetList of facetLists"
      :key="facetList.facet.id"
    >
      <UDropdownMenu
        :items="facetList.items"
        :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
      >
        <UButton
          block
          :label="facetList.facet.name"
          color="neutral"
          variant="soft"
          size="xl"
          class="px-4 py-3 justify-start data-[state=open]:bg-elevated"
        />
      </UDropdownMenu>
    </template>
  </div>
</template>

<style scoped>

</style>
