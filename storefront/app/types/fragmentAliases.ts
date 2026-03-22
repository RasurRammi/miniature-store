import type {
  SimpleAssetFragment,
  SimpleCollectionFieldsFragment,
  SimpleFacetFieldsFragment,
  SimpleFacetValueFieldsFragment,
  SimpleProductFieldsFragment,
  SimpleProductVariantFieldsFragment,
} from '~/gql/admin/graphql'

export type Asset = SimpleAssetFragment
export type Collection = SimpleCollectionFieldsFragment
export type Facet = SimpleFacetFieldsFragment
export type FacetValue = SimpleFacetValueFieldsFragment
export type Product = SimpleProductFieldsFragment
export type ProductVariant = SimpleProductVariantFieldsFragment
