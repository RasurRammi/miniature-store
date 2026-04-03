<script setup lang="ts">
import { useProductDrawerStore } from '~/stores/productDrawer'
import { useBundles } from '~/composables/useBundles'
import type { Asset, Collection, Facet, ProductVariant } from '~/types/fragmentAliases'
import { type ProductInput, useSubmitProduct } from '~/composables/admin/useSubmitProduct'
import ImageCarousel from '~/components/common/ImageCarousel.vue'
import { useAssetSelectionDrawerStore } from '~/stores/assetSelectionDrawer'
import DrawerLayout from '~/components/common/DrawerLayout.vue'
import { useAssets } from '~/composables/admin/useAssets'
import { useAdminUser } from '~/composables/admin/useUser'
import { useRootReleaseBundle } from '~/composables/useRootReleaseBundle'
import { useFacets } from '~/composables/admin/useFacets'

const adminUser = useAdminUser()
const productDrawer = useProductDrawerStore()
const assetSelectionDrawer = useAssetSelectionDrawerStore()

const { productV } = defineProps<{
  productV?: ProductVariant
}>()

const { data: rootReleaseCol } = await useRootReleaseBundle()
const { data: bundleData } = useBundles()
const selectedRelease = computed(() => productV?.product.collections.find(c => c.parentId === rootReleaseCol.value?.id))
const viableBundles = computed(() => {
  if (!bundleData.value) {
    return []
  }
  return bundleData.value.collections.items.map((bundle: Collection) => {
    return {
      id: bundle.id,
      label: bundle.name,
    }
  })
})

const { data: assetsData } = useAssets()
const selectedAssets = computed<Asset[]>(() => {
  if (!assetsData.value) return []
  return form.assetIds.map((assetId: string) => assetsData.value.assets.items.find((asset: Asset) => asset.id === assetId)!)
})

const { data: facetsData } = useFacets()
const viableTags = computed(() => {
  const facets = facetsData.value?.facets.items ?? []
  return facets.flatMap((facet: Facet) => {
    return [
      { type: 'label', name: facet.name },
      ...facet.values,
      { type: 'separator' },
    ]
  })
})

// ---- Form and Editing
const isNew = computed(() => !productV?.id)
const mayEdit = computed(() => !!adminUser.data.value)
const isEditing = ref(isNew.value)
const form = reactive<ProductInput>(productVToForm())

watch(() => productV, () => {
  Object.assign(form, productVToForm())
  isEditing.value = isNew.value
}, { immediate: true })

const emit = defineEmits<{ editingStateChanged: [boolean] }>()
watch(isEditing, val => emit('editingStateChanged', val))

function startEditing() {
  Object.assign(form, productVToForm())
  isEditing.value = true
}

function cancelEditing() {
  Object.assign(form, productVToForm())
  isEditing.value = false
}

function productVToForm(): ProductInput {
  return {
    productId: productV?.product.id,
    variantId: productV?.id,
    name: productV?.product.name ?? '',
    description: productV?.product.description ?? '',
    price: productV?.price ?? 0,
    releaseId: selectedRelease.value?.id,
    collectionIds: productV?.product.collections.map(c => c.id) ?? [],
    tagIds: productV?.product.facetValues.map(fV => fV.id) ?? [],
    assetIds: productV?.product.assets.map(asset => asset.id) ?? [],
  }
}

const toast = useToast()
const submitProduct = useSubmitProduct()
async function submitForm() {
  submitProduct.mutate(form, {
    onSuccess: (data) => {
      productDrawer.updateData(data!)
      cancelEditing()
      toast.add({
        title: 'Product successfully updated',
        description: 'The product was successfully updated',
        icon: 'i-lucide-check',
        color: 'success',
      })
    },
    onError: (err) => {
      console.log(err)
      toast.add({
        title: 'An error occurred when trying to update the product',
        description: err.name + ': ' + err.message,
        icon: 'i-lucide-x',
        color: 'error',
      })
    },
  })
}
</script>

<template>
  <DrawerLayout @close="productDrawer.close">
    <template #title>
      <span v-if="productV && !isEditing">
        {{ productV.product.name }}
      </span>
      <UInput
        v-else
        v-model="form.name"
        placeholder="Product name"
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
      <UButton
        icon="i-lucide-expand"
        :to="`/store/product/${productV?.product.id}`"
        color="neutral"
        variant="ghost"
        class="cursor-pointer"
      />
    </template>
    <template #header>
      <USelectMenu
        v-if="isEditing"
        v-model="form.releaseId"
        size="lg"
        icon="i-lucide-package-2"
        value-key="id"
        :items="viableBundles"
      />

      <!-- Tags -->
      <div class="flex gap-1">
        <UInputMenu
          v-if="isEditing"
          v-model="form.tagIds"
          :items="viableTags"
          multiple
          value-key="id"
          label-key="name"
          icon="i-lucide-tag"
          open-on-focus
          class="flex-1"
          size="lg"
          :ui="{ label: 'text-muted', tagsItem: 'text-md' }"
        />
        <template v-else>
          <UBadge
            v-if="selectedRelease"
            :label="selectedRelease.name"
            variant="subtle"
            color="primary"
            size="lg"
          />
          <UBadge
            v-for="tag in productV?.product.facetValues"
            :key="tag.id"
            :label="tag.name"
            variant="subtle"
            color="neutral"
            size="lg"
          />
        </template>
      </div>
    </template>

    <ImageCarousel
      v-if="!isEditing"
      :images="productV?.product.assets ?? []"
    />
    <ImageCarousel
      v-else
      :images="selectedAssets"
    />

    <div v-if="isEditing">
      <UButton
        variant="subtle"
        icon="i-lucide-image-plus"
        label="Manage Images"
        class="w-full h-16 rounded-xl flex items-center justify-center gap-2 text-2xl"
        @click.prevent="() => assetSelectionDrawer.open(productV?.product)"
      />
      <AssetSelection v-model="form.assetIds" />
    </div>

    <!-- Description -->
    <div v-if="productV && !isEditing">
      <p
        v-if="productV.product.description"
        class="text-muted bg-elevated rounded-md p-2"
      >
        {{ productV.product.description }}
      </p>
    </div>
    <UTextarea
      v-else
      v-model="form.description"
      placeholder="Description..."
      :autoresize="true"
      variant="soft"
    />

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
    <div
      v-else
      class="flex flex-row-reverse gap-2"
    >
      <UButton
        icon="i-lucide-shopping-basket"
        size="xl"
      >
        Add to Cart
      </UButton>
      <UButton
        icon="i-lucide-download"
        size="xl"
      >
        Download
      </UButton>
    </div>
  </DrawerLayout>
</template>

<style scoped>

</style>
