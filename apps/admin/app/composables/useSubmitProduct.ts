import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  AssignProductToCollectionDocument,
  CreateProductDocument,
  CreateProductVariantDocument,
  GetCollectionFiltersDocument,
  LanguageCode,
  UpdateProductDocument,
  UpdateProductVariantDocument,
} from '~/gql/graphql'
import { slugify } from '~/utils/slugify'

export type ProductInput = {
  productId?: string
  variantId?: string
  name: string
  description: string
  price: number
  releaseId?: string
  tagIds: string[]
  collectionIds: string[]
  assetIds: string[]
}

export function useSubmitProduct() {
  const { $gqlClient } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const isNew = !input.productId
      let product, productVariants

      // ---- Product & Variant -----
      if (isNew) {
        // Create Product and 1 Variant
        const inputProduct = {
          translations: [{
            languageCode: LanguageCode.en,
            name: input.name,
            slug: slugify(input.name), // Set slug for new products
            description: input.description,
          }],
          facetValueIds: input.tagIds,
          featuredAssetId: input.assetIds[0],
          assetIds: input.assetIds,
        }
        const inputProductVariant = {
          sku: slugify(input.name), // Set sku for new products
          price: input.price,
          translations: [{ languageCode: LanguageCode.en, name: input.name }],
        }
        product = (await $gqlClient.request(CreateProductDocument, {
          input: inputProduct,
        })).createProduct
        productVariants = (await $gqlClient.request(CreateProductVariantDocument, {
          input: [{ ...inputProductVariant, productId: product.id }],
        })).createProductVariants
      }
      else {
        // Update Product & Variant
        const inputProduct = {
          id: input.productId!, // Set id for existing products
          translations: [{
            languageCode: LanguageCode.en,
            name: input.name,
            description: input.description,
          }],
          facetValueIds: input.tagIds,
          featuredAssetId: input.assetIds[0],
          assetIds: input.assetIds,
        }
        const inputProductVariant = {
          id: input.variantId!, // Set id for existing variants
          price: input.price,
          translations: [{ languageCode: LanguageCode.en, name: input.name }],
        }
        product = (await $gqlClient.request(UpdateProductDocument, {
          input: inputProduct,
        })).updateProduct

        productVariants = (await $gqlClient.request(UpdateProductVariantDocument, {
          input: [inputProductVariant],
        })).updateProductVariants
      }

      // ---- Collections -----
      const allCollections = [...new Set(input.releaseId ? [...input.collectionIds, input.releaseId] : input.collectionIds)]
      if (!isNew || allCollections.length) {
        const { collections } = await $gqlClient.request(GetCollectionFiltersDocument, {
          options: isNew
            ? { filter: { id: { in: allCollections} } } // create: fetch only selected
            : {}, // update: fetch all to remove from prior-ly included
        })

        await Promise.all(
          collections.items.map(async (collection) => {
            const existingFilter = collection.filters.find(f => f.code === 'product-id-filter')
            const existingIds: string[] = existingFilter
              ? JSON.parse(existingFilter.args.find(a => a.name === 'productIds')?.value ?? '[]')
              : []

            const toInclude = allCollections.includes(collection.id)
            const isAlreadyIncluded = existingIds.includes(product.id)

            if (toInclude && isAlreadyIncluded) return
            if (!toInclude && !isAlreadyIncluded) return

            const mergedIds = toInclude
              ? [...new Set([...existingIds, product.id])]
              : existingIds.filter(id => id !== product.id)

            await $gqlClient.request(AssignProductToCollectionDocument, {
              collectionId: collection.id,
              productIds: JSON.stringify(mergedIds),
            })
          }),
        )
      }

      // ---- Done ----
      return productVariants[0]
    },
    onSuccess: async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
