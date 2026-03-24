<script setup lang="ts">
import type { Collection, Product } from '~/types/fragmentAliases'
import { useAdminUser } from '~/composables/admin/useAdminUser'
import { useReleaseDrawerStore } from '~/stores/releaseDrawer'
import { type CollectionInput, useSubmitCollection } from '~/composables/admin/useSubmitCollection'
import { useRootReleaseBundle } from '~/composables/useRootReleaseBundle'
import SelectionGrid from '~/components/common/SelectionGrid.vue'
import FlexibleGrid from '~/components/common/FlexibleGrid.vue'
import DrawerLayout from '~/components/common/DrawerLayout.vue'

const adminUser = useAdminUser()
const releaseDrawer = useReleaseDrawerStore()
const { data: rootBundleCol } = useRootReleaseBundle()

const { release } = defineProps<{
  release?: Collection
}>()

// ----- Product Selection -----
const { data: productsData } = useProducts()
const products = computed(() => productsData.value?.products.items ?? [])
const selectedCopy = ref<string[]>(release?.productVariants.items.map(pV => pV.product.id) ?? [])
const selectedProductsCopy = computed<Product[]>(() => {
  const pMap = new Map(products.value.map((p: Product) => [p.id, p]))
  return selectedCopy.value.flatMap((id) => {
    const product = pMap.get(id)
    return product ? [product] : []
  })
})

// ----- Creating/Editing Variables -----
const isNew = computed(() => !release?.id)
const mayEdit = computed(() => !!adminUser.data.value)
const isEditing = ref(isNew.value || mayEdit.value)

const form = reactive<CollectionInput>(releaseToForm())
function startEditing() {
  Object.assign(form, releaseToForm())
  isEditing.value = true
}
function cancelEditing() {
  Object.assign(form, releaseToForm())
  isEditing.value = false
}
function releaseToForm(): CollectionInput {
  return {
    collectionId: release?.id,
    name: release?.name ?? '',
    description: release?.description ?? '',
    selectedProductIds: selectedCopy.value,
  }
}

const toast = useToast()
const submitCollection = useSubmitCollection()

async function submitForm() {
  if (!rootBundleCol.value) return
  form.parentId = rootBundleCol.value.id
  form.selectedProductIds = selectedCopy.value // set it again in case it changed
  submitCollection.mutate(form, {
    onSuccess: (data) => {
      toast.add({
        title: 'Release successfully ' + (form.collectionId ? 'updated' : 'created'),
        description: `The release ${form.name} was successfully ` + (form.collectionId ? 'updated' : 'created'),
        icon: 'i-lucide-check',
        color: 'success',
      })
    },
    onError: (error) => {
      console.log(error)
      toast.add({
        title: form.collectionId ? 'Updating release failed' : 'Creating release failed',
        description: error.message,
        color: 'error',
      })
    },
  })
}
</script>

<template>
  <DrawerLayout @close="releaseDrawer.close">
    <template #title>
      <span v-if="release && !isEditing">
        {{ release.name }}
      </span>
      <UInput
        v-else
        v-model="form.name"
        placeholder="Release name"
        size="xl"
      />
    </template>
    <template #actions>
      <template v-if="!isNew">
        <UButton
          v-if="isEditing"
          icon="i-lucide-pencil-off"
          color="neutral"
          variant="ghost"
          class="cursor-pointer"
          @click.prevent="cancelEditing"
        />
        <UButton
          v-else-if="mayEdit"
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          class="cursor-pointer"
          @click.prevent="startEditing"
        />
      </template>
    </template>

    <!-- Description -->
    <div v-if="release && !isEditing">
      <p
        v-if="release.description"
        class="text-muted bg-elevated rounded-md p-2"
      >
        {{ release.description }}
      </p>
    </div>
    <UTextarea
      v-else
      v-model="form.description"
      placeholder="Description..."
      :autoresize="true"
      variant="soft"
    />

    <!-- Product selection -->
    <span class="text-lg font-bold">Assign Products</span>

    <FlexibleGrid :items="selectedProductsCopy">
      <template #default="{ item }">
        <img
          :src="item.featuredAsset?.preview"
          class="w-full h-full object-cover bg-muted"
          :alt="item.name"
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
    </div>

    <SelectionGrid
      v-model="selectedCopy"
      :items="products"
    >
      <template #default="{ item }">
        <img
          :src="item.featuredAsset?.preview"
          class="w-full h-full object-cover bg-muted"
          :alt="item.name"
        >
      </template>
    </SelectionGrid>

    <USeparator />

    <!-- Buttons -->
    <div
      v-if="isEditing"
      class="flex justify-center"
    >
      <UButton
        icon="i-lucide-check"
        size="xl"
        @click="submitForm"
      >
        {{ isNew ? 'Create' : 'Update' }}
      </UButton>
    </div>
  </DrawerLayout>
</template>

<style scoped>

</style>
