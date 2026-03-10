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
    "fragment SimpleBundleFields on Collection {\n  id\n  name\n  slug\n  featuredAsset {\n    preview\n  }\n  productVariants {\n    items {\n      ...SimpleProductVariantFields\n    }\n  }\n}": typeof types.SimpleBundleFieldsFragmentDoc,
    "fragment SimpleProductFields on Product {\n  id\n  name\n  slug\n  description\n  featuredAsset {\n    preview\n  }\n  variants {\n    id\n    price\n    currencyCode\n  }\n}": typeof types.SimpleProductFieldsFragmentDoc,
    "fragment SimpleProductVariantFields on ProductVariant {\n  id\n  price\n  currencyCode\n  name\n  product {\n    id\n    name\n    slug\n    description\n    featuredAsset {\n      preview\n    }\n    collections {\n      id\n      name\n    }\n  }\n}": typeof types.SimpleProductVariantFieldsFragmentDoc,
    "query GetBundles {\n  collections {\n    items {\n      ...SimpleBundleFields\n    }\n  }\n}": typeof types.GetBundlesDocument,
    "mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}": typeof types.LoginDocument,
    "mutation ShopLogout {\n  logout {\n    success\n  }\n}": typeof types.ShopLogoutDocument,
    "query ShopMe {\n  me {\n    id\n    identifier\n  }\n}": typeof types.ShopMeDocument,
    "query GetProducts {\n  products(options: {filter: {enabled: {eq: true}}}) {\n    items {\n      ...SimpleProductFields\n    }\n  }\n}": typeof types.GetProductsDocument,
    "mutation Register($input: RegisterCustomerInput!) {\n  registerCustomerAccount(input: $input) {\n    ... on Success {\n      success\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}": typeof types.RegisterDocument,
    "mutation VerifyCustomerAccount($token: String!) {\n  verifyCustomerAccount(token: $token) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}": typeof types.VerifyCustomerAccountDocument,
};
const documents: Documents = {
    "fragment SimpleBundleFields on Collection {\n  id\n  name\n  slug\n  featuredAsset {\n    preview\n  }\n  productVariants {\n    items {\n      ...SimpleProductVariantFields\n    }\n  }\n}": types.SimpleBundleFieldsFragmentDoc,
    "fragment SimpleProductFields on Product {\n  id\n  name\n  slug\n  description\n  featuredAsset {\n    preview\n  }\n  variants {\n    id\n    price\n    currencyCode\n  }\n}": types.SimpleProductFieldsFragmentDoc,
    "fragment SimpleProductVariantFields on ProductVariant {\n  id\n  price\n  currencyCode\n  name\n  product {\n    id\n    name\n    slug\n    description\n    featuredAsset {\n      preview\n    }\n    collections {\n      id\n      name\n    }\n  }\n}": types.SimpleProductVariantFieldsFragmentDoc,
    "query GetBundles {\n  collections {\n    items {\n      ...SimpleBundleFields\n    }\n  }\n}": types.GetBundlesDocument,
    "mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}": types.LoginDocument,
    "mutation ShopLogout {\n  logout {\n    success\n  }\n}": types.ShopLogoutDocument,
    "query ShopMe {\n  me {\n    id\n    identifier\n  }\n}": types.ShopMeDocument,
    "query GetProducts {\n  products(options: {filter: {enabled: {eq: true}}}) {\n    items {\n      ...SimpleProductFields\n    }\n  }\n}": types.GetProductsDocument,
    "mutation Register($input: RegisterCustomerInput!) {\n  registerCustomerAccount(input: $input) {\n    ... on Success {\n      success\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}": types.RegisterDocument,
    "mutation VerifyCustomerAccount($token: String!) {\n  verifyCustomerAccount(token: $token) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}": types.VerifyCustomerAccountDocument,
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
export function graphql(source: "fragment SimpleBundleFields on Collection {\n  id\n  name\n  slug\n  featuredAsset {\n    preview\n  }\n  productVariants {\n    items {\n      ...SimpleProductVariantFields\n    }\n  }\n}"): (typeof documents)["fragment SimpleBundleFields on Collection {\n  id\n  name\n  slug\n  featuredAsset {\n    preview\n  }\n  productVariants {\n    items {\n      ...SimpleProductVariantFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment SimpleProductFields on Product {\n  id\n  name\n  slug\n  description\n  featuredAsset {\n    preview\n  }\n  variants {\n    id\n    price\n    currencyCode\n  }\n}"): (typeof documents)["fragment SimpleProductFields on Product {\n  id\n  name\n  slug\n  description\n  featuredAsset {\n    preview\n  }\n  variants {\n    id\n    price\n    currencyCode\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment SimpleProductVariantFields on ProductVariant {\n  id\n  price\n  currencyCode\n  name\n  product {\n    id\n    name\n    slug\n    description\n    featuredAsset {\n      preview\n    }\n    collections {\n      id\n      name\n    }\n  }\n}"): (typeof documents)["fragment SimpleProductVariantFields on ProductVariant {\n  id\n  price\n  currencyCode\n  name\n  product {\n    id\n    name\n    slug\n    description\n    featuredAsset {\n      preview\n    }\n    collections {\n      id\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetBundles {\n  collections {\n    items {\n      ...SimpleBundleFields\n    }\n  }\n}"): (typeof documents)["query GetBundles {\n  collections {\n    items {\n      ...SimpleBundleFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}"): (typeof documents)["mutation Login($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ShopLogout {\n  logout {\n    success\n  }\n}"): (typeof documents)["mutation ShopLogout {\n  logout {\n    success\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ShopMe {\n  me {\n    id\n    identifier\n  }\n}"): (typeof documents)["query ShopMe {\n  me {\n    id\n    identifier\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProducts {\n  products(options: {filter: {enabled: {eq: true}}}) {\n    items {\n      ...SimpleProductFields\n    }\n  }\n}"): (typeof documents)["query GetProducts {\n  products(options: {filter: {enabled: {eq: true}}}) {\n    items {\n      ...SimpleProductFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($input: RegisterCustomerInput!) {\n  registerCustomerAccount(input: $input) {\n    ... on Success {\n      success\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}"): (typeof documents)["mutation Register($input: RegisterCustomerInput!) {\n  registerCustomerAccount(input: $input) {\n    ... on Success {\n      success\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation VerifyCustomerAccount($token: String!) {\n  verifyCustomerAccount(token: $token) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}"): (typeof documents)["mutation VerifyCustomerAccount($token: String!) {\n  verifyCustomerAccount(token: $token) {\n    ... on CurrentUser {\n      id\n      identifier\n    }\n    ... on ErrorResult {\n      errorCode\n      message\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;