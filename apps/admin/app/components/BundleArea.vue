<script setup lang="ts">
import type { Collection } from '~/types/fragmentAliases'
import { useProductDrawerStore, useReleaseDrawerStore } from '#imports'
import {GridArea} from "@miniature-store/shared/components";

const productDrawer = useProductDrawerStore()
const releaseDrawer = useReleaseDrawerStore()
const { release } = defineProps<{ release: Collection }>()
</script>

<template>
  <GridArea
    :collapsible="true"
    :initial-state="true"
  >
    <template #header>
      <span class="font-bold">{{ release.name }}</span>
      <UBadge
          :label="'Active'"
          variant="subtle"
          color="primary"
      />
    </template>
    <template #actions>
      <UButton
        block
        variant="solid"
        color="secondary"
        icon="i-lucide-plus"
        label="Create Product"
        size="lg"
        :ui="{ label: 'hidden sm:block' }"
        @click.stop="productDrawer.open()"
      />
      <UButton
        variant="solid"
        color="primary"
        icon="i-lucide-pencil"
        label="Edit Release"
        size="lg"
        :ui="{ label: 'hidden sm:block' }"
        @click.stop="releaseDrawer.open(release)"
      />
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
