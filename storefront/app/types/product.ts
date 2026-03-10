import type { ProductVariant } from '~/gql/admin/graphql'

export type { ProductVariant }

export type ProductDraft = {
  name: string
  description: string
  price: number
  collectionIds: string[]
  tags: string[]
  images: string[]
}

export function createEmptyDraft(): ProductDraft {
  return {
    name: '',
    description: '',
    price: 0,
    collectionIds: [],
    tags: [],
    images: [],
  }
}
