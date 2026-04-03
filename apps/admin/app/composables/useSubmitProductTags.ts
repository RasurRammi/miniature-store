import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { UpdateProductsDocument } from '~/gql/graphql'

export type ProductTagsInput = {
  productId: string
  tagIds: string[]
}

export function useSubmitProductTags() {
  const { $gqlClient } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inputs: ProductTagsInput[]) => {
      const inputProduct = inputs.map(pI => ({
        id: pI.productId,
        facetValueIds: pI.tagIds,
      }))

      // update product
      return (await $gqlClient.request(UpdateProductsDocument, {
        input: inputProduct,
      })).updateProducts
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
