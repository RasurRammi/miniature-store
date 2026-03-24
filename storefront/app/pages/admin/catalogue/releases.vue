<script setup lang="ts">
import GridArea from '~/components/common/GridArea.vue'
import { type CollectionInput, useSubmitCollection } from '~/composables/admin/useSubmitCollection'
import { useRootReleaseBundle } from '~/composables/useRootReleaseBundle'
import { useBundles } from '~/composables/useBundles'
import BundleArea from '~/components/BundleArea.vue'
import { useAssets } from '~/composables/admin/useAssets'

// TODO remove for production
definePageMeta({
  layout: 'admin',
})

const { data: releasesData, isLoading, error } = useBundles()
const releasesDrawer = useReleaseDrawerStore()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row justify-between items-center">
      <h1 class="text-2xl font-bold ">
        Releases
      </h1>
      <UButton
        variant="solid"
        color="primary"
        icon="i-lucide-plus"
        label="Add Release"
        size="xl"
        @click.stop="releasesDrawer.open()"
      />
    </div>

    <div class="flex-1 flex flex-col gap-4">
      <template v-if="releasesData && releasesData.collections.items.length">
        <BundleArea
          v-for="release in releasesData.collections.items"
          :key="release.id"
          :release="release"
        />
      </template>

      <template v-else>
        <UEmpty
          title="No Releases found"
          variant="subtle"
        />
      </template>
    </div>

    <ReleaseSlideover />
    <ProductSlideover />
  </div>
</template>

<style scoped>

</style>
