import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { UpdateProductsDocument } from '~/gql/admin/graphql'

export type ProductTagsInput = {
  productId: string
  tagIds: string[]
}

export function useSubmitProductTags() {
  const { $adminGqlClient } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inputs: ProductTagsInput[]) => {
      const inputProduct = inputs.map(pI => ({
        id: pI.productId,
        facetValueIds: pI.tagIds,
      }))

      // update product
      return (await $adminGqlClient.request(UpdateProductsDocument, {
        input: inputProduct,
      })).updateProducts
    },
    onSuccess: () => {
      console.log('useSubmitProduct: invalidate queries!')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
