<script setup lang="ts">
import { useAssets } from '~/composables/useAssets'
import type { Asset } from '~/types/fragmentAliases'
import {SelectionGrid} from "@miniature-store/shared/components";

const { data: assetsData } = useAssets()

const assets = computed(() => assetsData.value?.assets.items ?? [])
const selectedAssetIds = ref<string[]>([])
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-row justify-between items-center">
      <h1 class="text-2xl font-bold ">
        Assets
      </h1>

      <UFileUpload
        v-slot="{ open }"
        v-model="uploadedFiles"
        accept="image/*"
        multiple
      >
        <UButton
          icon="i-lucide-upload"
          label="Upload"
          class="h-full"
          size="xl"
          @click="open"
        />
      </UFileUpload>
    </div>

    <SelectionGrid
      v-model="selectedAssetIds"
      :items="assets"
      :size="12"
      :disabled="disabled"
    >
      <template #default="{ item: asset }: {item: Asset}">
        <img
          :src="asset.preview"
          :alt="asset.name"
          loading="lazy"
          class="bg-muted"
        >
      </template>
      <template #empty>
        <UEmpty
          title="No Assets matching the currents filters"
        />
      </template>
    </SelectionGrid>
  </div>
</template>

<style scoped>

</style>
