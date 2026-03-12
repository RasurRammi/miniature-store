<script setup lang="ts">
import type { ProductDraft, ProductVariant } from '~/types/product'
import { useProductDrawerStore } from '~/stores/productDrawer'
import { useBundles } from '~/composables/useBundles'
import type { Collection } from '~/gql/shop/graphql'
import { type ProductInput, useSubmitProduct } from '~/composables/admin/useSubmitProduct'

const productDrawer = useProductDrawerStore()

const { productV, canEdit } = defineProps<{
  productV?: ProductVariant
  canEdit?: boolean
}>()
const emit = defineEmits<{
  submit: [data: ProductDraft]
  cancel: []
}>()
const isNew = computed(() => !productV?.id)
const isEditing = ref(isNew.value)

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
    images: [],
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

const toast = useToast()
const submitProduct = useSubmitProduct()

async function submitForm() {
  submitProduct.mutate(form, {
    onSuccess: (data) => {
      cancelEditing()
      productDrawer.open(data.variant)
      toast.add({
        title: 'Product successfully created',
        description: 'The product was successfully created',
        icon: 'i-lucide-check',
        color: 'success',
      })
    },
    onError: (err) => {
      toast.add({
        title: 'An error occurred when trying to create the product',
        description: err.name + ': ' + err.message,
        icon: 'i-lucide-x',
        color: 'error',
      })
    },
  })
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <div class="flex flex-col gap-2">
      <!-- Drawer Header -->
      <div class="flex items-center justify-between">
        <!-- Product Name -->
        <h2 class="text-xl font-bold">
          <span v-if="productV && !isEditing">
            {{ productV.product.name }}
          </span>
          <UInput
            v-else
            v-model="form.name"
            placeholder="Product name"
            size="xl"
          />
        </h2>
        <div class="flex items-center gap-1">
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
              v-else
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              class="cursor-pointer"
              @click.prevent="startEditing"
            />
          </template>
          <UButton
            icon="i-lucide-expand"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
          />
          <UButton
            icon="i-lucide-arrow-right"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
            @click="productDrawer.close()"
          />
        </div>
      </div>

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
    </div>

    <div class="flex flex-col gap-4">
      <!-- Images -->
      <!--
      <div class="flex flex-col gap-2">
        <div class="aspect-square w-full rounded-xl overflow-hidden bg-muted border border-default">
          <img
            v-if="selectedImg"
            :src="selectedImg"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <span v-else class="w-full h-full flex items-center justify-center">
            <UIcon name="i-lucide-image" class="size-32 text-muted"/>
          </span>
        </div>

        <div class="flex flex-row gap-2">
          <template v-if="product.images.length > 1">
            <div
              v-for="image in product.images"
              :key="image"
              class="aspect-square w-20 rounded-lg bg-muted overflow-hidden cursor-pointer ring-2 transition-all"
              :class="selectedImg === image ? 'ring-primary' : 'ring-transparent'"
              @click="selectedImg = image"
            >
              <img :src="image" class="w-full h-full object-cover" :alt="product.name"/>
            </div>
          </template>

          <div v-if="editing">
            <UFileUpload
              multiple
              accept="image/*"
              :ui="{base: 'w-24 h-24'}"
            />
          </div>
        </div>
      </div>
      -->

      <!-- Bundles -->
      <UInputMenu
        v-if="isEditing"
        v-model="form.collectionIds"
        multiple
        size="xl"
        icon="i-lucide-package-2"
        value-key="id"
        :items="viableBundles"
      />

      <!-- Description -->
      <div
        v-if="productV && !isEditing"
        class="p-2"
      >
        <p
          v-if="productV.product.description"
          class="text-muted bg-elevated rounded-md"
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
    </div>
  </div>
</template>

<style scoped>

</style>
