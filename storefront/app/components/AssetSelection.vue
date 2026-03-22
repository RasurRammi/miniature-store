<script setup lang="ts">
import { useAssets } from '~/composables/admin/useAssets'
import { useAssetSelectionDrawerStore } from '~/stores/assetSelectionDrawer'
import DrawerLayout from '~/components/common/DrawerLayout.vue'
import { useUploadAssets } from '~/composables/admin/useUploadAssets'
import type { Asset } from '~/types/fragmentAliases'
import SelectionGrid from '~/components/common/SelectionGrid.vue'
import FlexibleGrid from '~/components/common/FlexibleGrid.vue'

const uploadAssets = useUploadAssets()
const assetSelectionDrawer = useAssetSelectionDrawerStore()
const { data: assetsData } = useAssets()

const selectedAssets = defineModel<string[]>({ required: true })
const selectedCopy = ref([...selectedAssets.value])
const selectedAssetsCopy = computed(() => {
  const itemMap = new Map(assetsData.value.assets.items.map((a: Asset) => [a.id, a]))
  return selectedCopy.value.flatMap((id) => {
    const asset = itemMap.get(id)
    return asset ? [asset] : []
  })
})

const uploadedFiles = ref<File[]>([])
watch(uploadedFiles, async (files) => {
  if (!files.length) return
  await uploadAssets.mutateAsync(files)
  uploadedFiles.value = []
})

function submitSelection() {
  selectedAssets.value = selectedCopy.value
  assetSelectionDrawer.close()
}
</script>

<template>
  <USlideover
    v-model:open="assetSelectionDrawer.isOpen"
    :title="'Image Selection'"
    :description="'Management for Images to the current Product'"
    :ui="{ content: 'max-w-full sm:max-w-lg md:max-w-xl lg:max-w-1/2 xl:max-w-1/3' }"
    :modal="false"
    @after:leave="() => {
      assetSelectionDrawer.onAfterLeave()
      selectedCopy = selectedAssets
    }"
  >
    <template #content>
      <DrawerLayout @close="assetSelectionDrawer.close">
        <template #title>
          Select Images for {{ assetSelectionDrawer.product?.name ?? 'New Product' }}
        </template>

        <span class="text-lg font-bold">Selected Images</span>
        <FlexibleGrid :items="selectedAssetsCopy">
          <template #default="{ item }">
            <img
              :src="item.preview"
              class="w-full h-full object-cover bg-muted"
            >
          </template>
        </FlexibleGrid>

        <USeparator />

        <div class="flex flex-row gap-1">
          <UInput
            trailing-icon="i-lucide-search"
            placeholder="Search..."
            size="xl"
            class="w-full flex-1"
          />
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
              color="secondary"
              @click="open"
            />
          </UFileUpload>
        </div>

        <SelectionGrid
          v-model="selectedCopy"
          :items="assetsData.assets.items"
        >
          <template #default="{ item }">
            <img
              :src="item.preview"
              class="w-full h-full object-cover bg-muted"
              :alt="item.name"
            >
          </template>
        </SelectionGrid>

        <USeparator />

        <div
          class="flex justify-center my-4"
        >
          <UButton
            icon="i-lucide-check"
            size="xl"
            @click="submitSelection"
          >
            Assign Images
          </UButton>
        </div>
      </DrawerLayout>
    </template>
  </USlideover>
</template>

<style scoped>

</style>
