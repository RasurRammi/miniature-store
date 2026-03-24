<script setup lang="ts">
import type { Collection } from '~/types/fragmentAliases'
import GridArea from '~/components/common/GridArea.vue'
import { useProductDrawerStore, useReleaseDrawerStore } from '#imports'

const productDrawer = useProductDrawerStore()
const releaseDrawer = useReleaseDrawerStore()
const { release } = defineProps<{ release: Collection }>()
</script>

<template>
  <GridArea
    :title="release.name"
    :collapsible="true"
    :initial-state="true"
  >
    <template #actions>
      <div class="flex gap-2">
        <UButton
          variant="solid"
          color="secondary"
          icon="i-lucide-plus"
          label="Create Product"
          size="lg"
          @click.stop="productDrawer.open()"
        />
        <UButton
          variant="solid"
          color="primary"
          icon="i-lucide-pencil"
          label="Edit Release"
          size="lg"
          @click.stop="releaseDrawer.open(release)"
        />
      </div>
    </template>
    <template
      v-if="release.productVariants?.items.length"
      #default
    >
      <ProductCard
        v-for="productV in release.productVariants.items"
        :key="productV.id"
        :product-v="productV"
      />
    </template>
    <template #empty>
      <UEmpty
        title="No Products assigned to this release yet"
        variant="subtle"
        class="m-4"
      />
    </template>
  </GridArea>
</template>

<style scoped>

</style>
