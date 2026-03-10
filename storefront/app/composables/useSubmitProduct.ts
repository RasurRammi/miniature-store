
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  CreateProductDocument,
  CreateProductVariantDocument,
  UpdateProductDocument,
  UpdateProductVariantDocument,
  AssignProductToCollectionDocument,
  GetCollectionFiltersDocument,
} from '~/gql/admin/graphql'
import { slugify } from '~/utils/slugify'
import type {Collection} from "~/gql/shop/graphql";
import {useUploadAssets} from "~/composables/admin/useUploadAssets";

export type ProductInput = {
  productId?: string
  variantId?: string
  name: string
  description: string
  price: number
  collectionIds: string[]
  images: File[]
}

export function useSubmitProduct() {
  const { $adminGqlClient } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const isNew = !input.productId
      let product
      let productVariants

      //const uploadFiles = useUploadAssets()
      //uploadFiles.mutate(input.images)

      if (isNew) {
        const { createProduct } = await $adminGqlClient.request(CreateProductDocument, {
          input: {
            translations: [{
              languageCode: 'en',
              name: input.name,
              slug: slugify(input.name),
              description: input.description,
            }]
          }
        })

        // create variant
        const { createProductVariants } = await $adminGqlClient.request(CreateProductVariantDocument, {
          input: [{
            productId: createProduct.id,
            translations: [{ languageCode: 'en', name: input.name }],
            price: input.price,
            sku: slugify(input.name),
          }]
        })
        product = createProduct
        productVariants = createProductVariants
      } else {
        // update product
        const { updateProduct } = await $adminGqlClient.request(UpdateProductDocument, {
          input: {
            id: input.productId,
            translations: [{
              languageCode: 'en',
              name: input.name,
              description: input.description,
            }]
          }
        })

        // update variant
        const { updateProductVariants } = await $adminGqlClient.request(UpdateProductVariantDocument, {
          input: [{
            id: input.variantId,
            price: input.price,
            translations: [{ languageCode: 'en', name: input.name }]
          }]
        })

        product = updateProduct
        productVariants = updateProductVariants
      }

      if (!isNew || input.collectionIds.length) {
        const { collections } = await $adminGqlClient.request(GetCollectionFiltersDocument, {
          options: isNew
            ? { filter: { id: { in: input.collectionIds } } }  // create: fetch only selected
            : {}  // update: fetch all to remove from prior-ly included
        })

        await Promise.all(
          collections.items.map(async (collection: Collection) => {
            const existingFilter = collection.filters.find(f => f.code === 'product-id-filter')
            const existingIds: string[] = existingFilter
              ? JSON.parse(existingFilter.args.find(a => a.name === 'productIds')?.value ?? '[]')
              : []

            const toInclude = input.collectionIds.includes(collection.id)
            const isAlreadyIncluded = existingIds.includes(product.id)

            if (toInclude && isAlreadyIncluded) return
            if (!toInclude && !isAlreadyIncluded) return

            const mergedIds = toInclude
              ? [...new Set([...existingIds, product.id])]
              : existingIds.filter(id => id !== product.id)

            await $adminGqlClient.request(AssignProductToCollectionDocument, {
              collectionId: collection.id,
              productIds: JSON.stringify(mergedIds)
            })
          })
        )
      }
      return {product: product, variant: productVariants[0]}
    },
    onSuccess: () => {
      console.log('invalidate queries!')
      queryClient.invalidateQueries({ queryKey: ['bundles'] })
    }
  })
}
