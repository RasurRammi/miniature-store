<script setup lang="ts">
import type { Collection } from '~/types/fragmentAliases'
import {GridArea} from "@miniature-store/shared/components";

const { release } = defineProps<{ release: Collection }>()
</script>

<template>
  <GridArea
    :title="release.name"
    :collapsible="true"
    :initial-state="true"
  >
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
