import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { CreateCollectionDocument, LanguageCode, UpdateCollectionDocument } from '~/gql/admin/graphql'
import { slugify } from '~/utils/slugify'

export type CollectionInput = {
  collectionId?: string
  name: string
  description: string
  parentId?: string
  selectedProductIds: string[]
}

export function useSubmitCollection() {
  const { $adminGqlClient } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CollectionInput) => {
      const colInput = {
        id: input.collectionId,
        translations: [{
          languageCode: LanguageCode.en,
          name: input.name,
          slug: slugify(input.name),
          description: input.description,
        }],
        filters: [
          {
            code: 'product-id-filter',
            arguments: [
              { name: 'productIds', value: JSON.stringify(input.selectedProductIds) },
              { name: 'combineWithAnd', value: 'true' }],
          },
        ],
        isPrivate: false,
        parentId: input.parentId,
      }

      const collection = !input.collectionId
        ? (await $adminGqlClient.request(CreateCollectionDocument, { input: colInput })).createCollection
        : (await $adminGqlClient.request(UpdateCollectionDocument, { input: colInput })).updateCollection

      return { collection: collection }
    },
    onSuccess: async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
      queryClient.invalidateQueries({ queryKey: ['releases'] })
      queryClient.invalidateQueries({ queryKey: ['collections'] })
    },
  })
}
