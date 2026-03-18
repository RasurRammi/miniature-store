<script setup lang="ts">
import GridArea from '~/components/common/GridArea.vue'
import { type CollectionInput, useSubmitCollection } from '~/composables/admin/useSubmitCollection'
import { useRootReleaseBundle } from '~/composables/useRootReleaseBundle'
import { useBundles } from '~/composables/useBundles'
import BundleArea from '~/components/BundleArea.vue'
import { useAssets } from '~/composables/admin/useAssets'

// TODO remove for production
definePageMeta({
  layout: 'admin-administration',
})

const { data: bundleData, isLoading, error } = useBundles()
const { data: allAssets } = useAssets()

const isCreating = ref(false)
const { data: rootBundleCol } = useRootReleaseBundle()

const bundleForm: CollectionInput = {
  name: '',
  parentId: '',
}
watch(rootBundleCol, (val) => {
  if (val?.id) bundleForm.parentId = val.id
}, { immediate: true })

const toast = useToast()
const submitBundle = useSubmitCollection()
async function submitForm() {
  submitBundle.mutate(bundleForm, {
    onSuccess: (data) => {
      console.log(data)
      toast.add({
        title: 'Bundle successfully created',
        description: `The bundle ${bundleForm.name} was successfully created`,
        icon: 'i-lucide-check',
        color: 'success',
      })
    },
    onError: (error) => {
      console.log(error)
      toast.add({
        title: 'Creating bundle failed',
        description: error.message,
        color: 'error',
      })
    },
  })
  isCreating.value = false
}
</script>

<template>
  <div class=" flex flex-col gap-4 my-6 mx-1 lg:my-12 lg:mx-4">
    <template v-if="isCreating">
      <GridArea
        :collapsible="false"
        :initial-state="false"
      >
        <template #header>
          <UInput
            v-model="bundleForm.name"
            placeholder="Bundle Name..."
            class="ml-12"
            size="lg"
            autofocus
          />
        </template>
        <template #actions>
          <UButton
            icon="i-lucide-check"
            label="Create"
            color="primary"
            @click="submitForm"
          />
        </template>
      </GridArea>
    </template>

    <template v-else>
      <UButton
        variant="subtle"
        icon="i-lucide-circle-plus"
        label="Add Release"
        class="w-full h-16 rounded-xl flex items-center justify-center gap-2 text-2xl"
        @click.prevent="isCreating = true"
      />
    </template>

    <div class="flex-1 flex flex-col gap-4">
      <template v-if="bundleData">
        <BundleArea
          v-for="bundle in bundleData.collections.items"
          :key="bundle.id"
          :bundle="bundle"
        />
      </template>

      <template v-else>
        <UEmpty title="No products found" />
      </template>
    </div>

    <ProductSlideover />
  </div>
</template>

<style scoped>

</style>
