<script setup lang="ts">
import type { ProductVariant } from '~/types/product'
import { useProductDrawerStore } from '~/stores/productDrawer'
import { useBundles } from '~/composables/useBundles'
import type { Asset, Collection } from '~/gql/shop/graphql'
import { type ProductInput, useSubmitProduct } from '~/composables/admin/useSubmitProduct'
import ImageCarousel from '~/components/common/ImageCarousel.vue'
import { useAssetSelectionDrawerStore } from '~/stores/assetSelectionDrawer'
import DrawerLayout from '~/components/common/DrawerLayout.vue'
import { useAssets } from '~/composables/admin/useAssets'
import { useAdminUser } from '~/composables/admin/useAdminUser'

const adminUser = useAdminUser()
const productDrawer = useProductDrawerStore()
const assetSelectionDrawer = useAssetSelectionDrawerStore()

const { productV } = defineProps<{
  productV?: ProductVariant
}>()
const isNew = computed(() => !productV?.id)
const mayEdit = computed(() => !!adminUser.data.value)
const isEditing = ref(isNew.value || mayEdit.value)

const form = reactive<ProductInput>(productVToForm())

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
    collectionIds: productV?.product.collections.map(c => c.id) ?? [],
    assetIds: productV?.product.assets.map(asset => asset.id) ?? [],
  }
}

const { data: bundleData } = useBundles()
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
  if (!assetsData.value) {
    return []
  }
  return form.assetIds.map((assetId: string) => assetsData.value.assets.items.find((asset: Asset) => asset.id === assetId))
})

const toast = useToast()
const submitProduct = useSubmitProduct()

async function submitForm() {
  submitProduct.mutate(form, {
    onSuccess: (data) => {
      cancelEditing()
      productDrawer.open(data.variant)
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
      <UInputMenu
        v-if="isEditing"
        v-model="form.collectionIds"
        multiple
        size="xl"
        icon="i-lucide-package-2"
        value-key="id"
        :items="viableBundles"
      />

      <!-- Tags -->
      <!--
      <div class="flex gap-1">
        <USelectMenu v-if="editing" v-model="product.tags" multiple :items="viableTags" trailing-icon="" size="size-4"
                     :ui="{ content: 'w-40 p-2' }">
          <template #default>
            <UButton
              icon="i-lucide-plus"
              variant="ghost"
              color="neutral"
            />
          </template>
        </USelectMenu>
        <UBadge v-for="tag in product.tags" :key="tag" :label="tag" variant="subtle" color="neutral"/>
      </div>
      -->
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
