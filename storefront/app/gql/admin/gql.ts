/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation AssignProductToCollection($collectionId: ID!, $productIds: String!) {\n  updateCollection(\n    input: {id: $collectionId, filters: [{code: \"product-id-filter\", arguments: [{name: \"productIds\", value: $productIds}, {name: \"combineWithAnd\", value: \"true\"}]}], inheritFilters: false}\n  ) {\n    id\n    name\n  }\n}": typeof types.AssignProductToCollectionDocument,
    "query GetCollectionFilters($options: CollectionListOptions) {\n  collections(options: $options) {\n    items {\n      id\n      filters {\n        code\n        args {\n          name\n          value\n        }\n      }\n    }\n  }\n}": typeof types.GetCollectionFiltersDocument,
    "mutation CreateAssets($input: [CreateAssetInput!]!) {\n  createAssets(input: $input) {\n    ... on Asset {\n      id\n      name\n      preview\n      source\n    }\n    ... on MimeTypeError {\n      errorCode\n      message\n    }\n  }\n}": typeof types.CreateAssetsDocument,
    "mutation CreateCollection($input: CreateCollectionInput!) {\n  createCollection(input: $input) {\n    ...SimpleCollectionFields\n  }\n}": typeof types.CreateCollectionDocument,
    "mutation CreateProduct($input: CreateProductInput!) {\n  createProduct(input: $input) {\n    ...SimpleProductFields\n  }\n}": typeof types.CreateProductDocument,
    "mutation CreateProductVariant($input: [CreateProductVariantInput!]!) {\n  createProductVariants(input: $input) {\n    ...SimpleProductVariantFields\n  }\n}": typeof types.CreateProductVariantDocument,
    "mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}": typeof types.LoginDocument,
    "mutation AdminLogout {\n  logout {\n    success\n  }\n}": typeof types.AdminLogoutDocument,
    "query AdminMe {\n  me {\n    id\n    identifier\n  }\n}": typeof types.AdminMeDocument,
    "mutation UpdateCollection($input: UpdateCollectionInput!) {\n  updateCollection(input: $input) {\n    ...SimpleCollectionFields\n  }\n}": typeof types.UpdateCollectionDocument,
    "mutation UpdateProduct($input: UpdateProductInput!) {\n  updateProduct(input: $input) {\n    ...SimpleProductFields\n  }\n}": typeof types.UpdateProductDocument,
    "mutation UpdateProductVariant($input: [UpdateProductVariantInput!]!) {\n  updateProductVariants(input: $input) {\n    ...SimpleProductVariantFields\n  }\n}": typeof types.UpdateProductVariantDocument,
    "fragment SimpleCollectionFields on Collection {\n  id\n  name\n  slug\n  featuredAsset {\n    preview\n  }\n  productVariants {\n    items {\n      ...SimpleProductVariantFields\n    }\n  }\n}": typeof types.SimpleCollectionFieldsFragmentDoc,
    "fragment SimpleProductFields on Product {\n  id\n  name\n  slug\n  description\n  featuredAsset {\n    preview\n  }\n  variants {\n    id\n    price\n    currencyCode\n  }\n}": typeof types.SimpleProductFieldsFragmentDoc,
    "fragment SimpleProductVariantFields on ProductVariant {\n  id\n  price\n  currencyCode\n  name\n  product {\n    id\n    name\n    slug\n    description\n    featuredAsset {\n      preview\n    }\n    collections {\n      id\n      name\n    }\n  }\n}": typeof types.SimpleProductVariantFieldsFragmentDoc,
};
const documents: Documents = {
    "mutation AssignProductToCollection($collectionId: ID!, $productIds: String!) {\n  updateCollection(\n    input: {id: $collectionId, filters: [{code: \"product-id-filter\", arguments: [{name: \"productIds\", value: $productIds}, {name: \"combineWithAnd\", value: \"true\"}]}], inheritFilters: false}\n  ) {\n    id\n    name\n  }\n}": types.AssignProductToCollectionDocument,
    "query GetCollectionFilters($options: CollectionListOptions) {\n  collections(options: $options) {\n    items {\n      id\n      filters {\n        code\n        args {\n          name\n          value\n        }\n      }\n    }\n  }\n}": types.GetCollectionFiltersDocument,
    "mutation CreateAssets($input: [CreateAssetInput!]!) {\n  createAssets(input: $input) {\n    ... on Asset {\n      id\n      name\n      preview\n      source\n    }\n    ... on MimeTypeError {\n      errorCode\n      message\n    }\n  }\n}": types.CreateAssetsDocument,
    "mutation CreateCollection($input: CreateCollectionInput!) {\n  createCollection(input: $input) {\n    ...SimpleCollectionFields\n  }\n}": types.CreateCollectionDocument,
    "mutation CreateProduct($input: CreateProductInput!) {\n  createProduct(input: $input) {\n    ...SimpleProductFields\n  }\n}": types.CreateProductDocument,
    "mutation CreateProductVariant($input: [CreateProductVariantInput!]!) {\n  createProductVariants(input: $input) {\n    ...SimpleProductVariantFields\n  }\n}": types.CreateProductVariantDocument,
    "mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}": types.LoginDocument,
    "mutation AdminLogout {\n  logout {\n    success\n  }\n}": types.AdminLogoutDocument,
    "query AdminMe {\n  me {\n    id\n    identifier\n  }\n}": types.AdminMeDocument,
    "mutation UpdateCollection($input: UpdateCollectionInput!) {\n  updateCollection(input: $input) {\n    ...SimpleCollectionFields\n  }\n}": types.UpdateCollectionDocument,
    "mutation UpdateProduct($input: UpdateProductInput!) {\n  updateProduct(input: $input) {\n    ...SimpleProductFields\n  }\n}": types.UpdateProductDocument,
    "mutation UpdateProductVariant($input: [UpdateProductVariantInput!]!) {\n  updateProductVariants(input: $input) {\n    ...SimpleProductVariantFields\n  }\n}": types.UpdateProductVariantDocument,
    "fragment SimpleCollectionFields on Collection {\n  id\n  name\n  slug\n  featuredAsset {\n    preview\n  }\n  productVariants {\n    items {\n      ...SimpleProductVariantFields\n    }\n  }\n}": types.SimpleCollectionFieldsFragmentDoc,
    "fragment SimpleProductFields on Product {\n  id\n  name\n  slug\n  description\n  featuredAsset {\n    preview\n  }\n  variants {\n    id\n    price\n    currencyCode\n  }\n}": types.SimpleProductFieldsFragmentDoc,
    "fragment SimpleProductVariantFields on ProductVariant {\n  id\n  price\n  currencyCode\n  name\n  product {\n    id\n    name\n    slug\n    description\n    featuredAsset {\n      preview\n    }\n    collections {\n      id\n      name\n    }\n  }\n}": types.SimpleProductVariantFieldsFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AssignProductToCollection($collectionId: ID!, $productIds: String!) {\n  updateCollection(\n    input: {id: $collectionId, filters: [{code: \"product-id-filter\", arguments: [{name: \"productIds\", value: $productIds}, {name: \"combineWithAnd\", value: \"true\"}]}], inheritFilters: false}\n  ) {\n    id\n    name\n  }\n}"): (typeof documents)["mutation AssignProductToCollection($collectionId: ID!, $productIds: String!) {\n  updateCollection(\n    input: {id: $collectionId, filters: [{code: \"product-id-filter\", arguments: [{name: \"productIds\", value: $productIds}, {name: \"combineWithAnd\", value: \"true\"}]}], inheritFilters: false}\n  ) {\n    id\n    name\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCollectionFilters($options: CollectionListOptions) {\n  collections(options: $options) {\n    items {\n      id\n      filters {\n        code\n        args {\n          name\n          value\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query GetCollectionFilters($options: CollectionListOptions) {\n  collections(options: $options) {\n    items {\n      id\n      filters {\n        code\n        args {\n          name\n          value\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateAssets($input: [CreateAssetInput!]!) {\n  createAssets(input: $input) {\n    ... on Asset {\n      id\n      name\n      preview\n      source\n    }\n    ... on MimeTypeError {\n      errorCode\n      message\n    }\n  }\n}"): (typeof documents)["mutation CreateAssets($input: [CreateAssetInput!]!) {\n  createAssets(input: $input) {\n    ... on Asset {\n      id\n      name\n      preview\n      source\n    }\n    ... on MimeTypeError {\n      errorCode\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateCollection($input: CreateCollectionInput!) {\n  createCollection(input: $input) {\n    ...SimpleCollectionFields\n  }\n}"): (typeof documents)["mutation CreateCollection($input: CreateCollectionInput!) {\n  createCollection(input: $input) {\n    ...SimpleCollectionFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateProduct($input: CreateProductInput!) {\n  createProduct(input: $input) {\n    ...SimpleProductFields\n  }\n}"): (typeof documents)["mutation CreateProduct($input: CreateProductInput!) {\n  createProduct(input: $input) {\n    ...SimpleProductFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateProductVariant($input: [CreateProductVariantInput!]!) {\n  createProductVariants(input: $input) {\n    ...SimpleProductVariantFields\n  }\n}"): (typeof documents)["mutation CreateProductVariant($input: [CreateProductVariantInput!]!) {\n  createProductVariants(input: $input) {\n    ...SimpleProductVariantFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}"): (typeof documents)["mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AdminLogout {\n  logout {\n    success\n  }\n}"): (typeof documents)["mutation AdminLogout {\n  logout {\n    success\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query AdminMe {\n  me {\n    id\n    identifier\n  }\n}"): (typeof documents)["query AdminMe {\n  me {\n    id\n    identifier\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateCollection($input: UpdateCollectionInput!) {\n  updateCollection(input: $input) {\n    ...SimpleCollectionFields\n  }\n}"): (typeof documents)["mutation UpdateCollection($input: UpdateCollectionInput!) {\n  updateCollection(input: $input) {\n    ...SimpleCollectionFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateProduct($input: UpdateProductInput!) {\n  updateProduct(input: $input) {\n    ...SimpleProductFields\n  }\n}"): (typeof documents)["mutation UpdateProduct($input: UpdateProductInput!) {\n  updateProduct(input: $input) {\n    ...SimpleProductFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateProductVariant($input: [UpdateProductVariantInput!]!) {\n  updateProductVariants(input: $input) {\n    ...SimpleProductVariantFields\n  }\n}"): (typeof documents)["mutation UpdateProductVariant($input: [UpdateProductVariantInput!]!) {\n  updateProductVariants(input: $input) {\n    ...SimpleProductVariantFields\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment SimpleCollectionFields on Collection {\n  id\n  name\n  slug\n  featuredAsset {\n    preview\n  }\n  productVariants {\n    items {\n      ...SimpleProductVariantFields\n    }\n  }\n}"): (typeof documents)["fragment SimpleCollectionFields on Collection {\n  id\n  name\n  slug\n  featuredAsset {\n    preview\n  }\n  productVariants {\n    items {\n      ...SimpleProductVariantFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment SimpleProductFields on Product {\n  id\n  name\n  slug\n  description\n  featuredAsset {\n    preview\n  }\n  variants {\n    id\n    price\n    currencyCode\n  }\n}"): (typeof documents)["fragment SimpleProductFields on Product {\n  id\n  name\n  slug\n  description\n  featuredAsset {\n    preview\n  }\n  variants {\n    id\n    price\n    currencyCode\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment SimpleProductVariantFields on ProductVariant {\n  id\n  price\n  currencyCode\n  name\n  product {\n    id\n    name\n    slug\n    description\n    featuredAsset {\n      preview\n    }\n    collections {\n      id\n      name\n    }\n  }\n}"): (typeof documents)["fragment SimpleProductVariantFields on ProductVariant {\n  id\n  price\n  currencyCode\n  name\n  product {\n    id\n    name\n    slug\n    description\n    featuredAsset {\n      preview\n    }\n    collections {\n      id\n      name\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;