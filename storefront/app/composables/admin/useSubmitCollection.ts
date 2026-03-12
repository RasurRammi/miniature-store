import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  CreateCollectionDocument,
  type CreateCollectionInput,
  LanguageCode,
  UpdateCollectionDocument,
} from '~/gql/admin/graphql'
import { slugify } from '~/utils/slugify'

export type CollectionInput = {
  collectionId?: string
  name: string
  parentId?: string
}

export function useSubmitCollection() {
  const { $adminGqlClient } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CollectionInput) => {
      const isNew = !input.collectionId
      let collection

      if (isNew) {
        const colInput: CreateCollectionInput = {
          translations: [{
            languageCode: LanguageCode.en,
            name: input.name,
            slug: slugify(input.name),
            description: '',
          }],
          filters: [
            { code: 'product-id-filter', arguments: [{ name: 'productId', value: '[]' }, { name: 'combineWithAnd', value: 'true' }] },
          ],
          isPrivate: false,
          parentId: input.parentId,
        }
        const { createCollection } = await $adminGqlClient.request(CreateCollectionDocument, { input: colInput })
        collection = createCollection
      }
      else {
        const { updateCollection } = await $adminGqlClient.request(UpdateCollectionDocument, {
          input: {
            id: input.collectionId,
            translations: [{
              languageCode: 'en',
              name: input.name,
              slug: slugify(input.name),
            }],
            isPrivate: false,
            parentId: input.parentId,
          },
        })
        collection = updateCollection
      }

      return { collection: collection }
    },
    onSuccess: () => {
      console.log('invalidate queries!')
      queryClient.invalidateQueries({ queryKey: ['bundles'] })
    },
  })
}
