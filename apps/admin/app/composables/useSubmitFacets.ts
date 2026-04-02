import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  CreateFacetDocument,
  CreateFacetValuesDocument, DeleteFacetsDocument, DeleteFacetValuesDocument,
  UpdateFacetDocument,
  UpdateFacetValuesDocument,
} from '~/gql/admin/graphql'
import { slugify } from '~/utils/slugify'

export type FacetInput = {
  id?: string
  name: string
  values: FacetValueInput[]
  isDirty: boolean
  isDeleted?: boolean
}
export type FacetValueInput = {
  id?: string
  name: string
  /* Only dirty should be provided - all those will be updated */
  isDeleted?: boolean
}

export function useSubmitFacets() {
  const { $adminGqlClient } = useNuxtApp()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: FacetInput[]) => {
      const deletedFacets = input.filter(fI => fI.isDeleted).map(f => f.id)
      const { deleteFacets } = await $adminGqlClient.request(DeleteFacetsDocument, { ids: deletedFacets })

      const remainingInput = input.filter(fI => !fI.isDeleted)
      const results = await Promise.all(remainingInput.map(async (facet) => {
        const isNew = !facet.id

        const facetInput = {
          id: facet.id,
          isPrivate: false,
          code: slugify(facet.name),
          translations: [{
            languageCode: 'en',
            name: facet.name,
          }],
        }

        const facetValuesInput = facet.values
          .filter(fI => !fI.isDeleted)
          .map((facetV) => {
            return {
              id: facetV.id,
              code: slugify(facetV.name),
              translations: [{
                languageCode: 'en',
                name: facetV.name,
              }],
            }
          })

        if (isNew) {
          const { createFacet } = await $adminGqlClient.request(CreateFacetDocument, { input: facetInput })

          const facetVInput = facetValuesInput.map((facetV) => {
            return {
              ...facetV,
              facetId: createFacet.id,
            }
          })
          const createdValues = facetVInput.length
            ? await $adminGqlClient.request(CreateFacetValuesDocument, { input: facetVInput })
            : []
          return { facet: createFacet, facetValues: createdValues }
        }
        else {
          const updateFacet = facet.isDirty
            ? (await $adminGqlClient.request(UpdateFacetDocument, { input: facetInput })).updateFacet
            : null

          const [toCreate, toUpdate, toDelete] = [
            facetValuesInput.filter(fv => !fv.id)
              .map(fv => ({ ...fv, facetId: facet.id })),
            facetValuesInput.filter(fv => !!fv.id),
            facet.values.filter(fV => fV.isDeleted).map(fV => fV.id),
          ]

          const created = toCreate.length
            ? (await $adminGqlClient.request(CreateFacetValuesDocument, { input: toCreate })).createFacetValues
            : []
          const updated = toUpdate.length
            ? (await $adminGqlClient.request(UpdateFacetValuesDocument, { input: toUpdate })).updateFacetValues
            : []
          const deleted = toDelete.length
            ? (await $adminGqlClient.request(DeleteFacetValuesDocument, { ids: toDelete })).deleteFacetValues
            : []

          return { facet: updateFacet, facetValues: [...created, ...updated], deletedValues: deleted }
        }
      }))
      return {
        deletedFacets: deleteFacets,
        deletedFacetValues: results.map(r => r.deletedValues),
        facets: results.map(r => r.facet),
        facetValues: results.map(r => r.facetValues) }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facets'] })
    },
  })
}
