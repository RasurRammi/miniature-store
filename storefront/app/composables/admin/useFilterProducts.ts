import type { FilterToken } from '~/types/filteredSearch'
import type { Product } from '~/types/fragmentAliases'

export function filterProducts(products: Product[], filterTokens: FilterToken[]): Product[] {
  const groupedTokens = Object.groupBy(filterTokens, token => token.categoryId)
  let filtered = products

  if (groupedTokens['tags']?.length) {
    filtered = filtered.filter((product: Product) => {
      console.log(product.facetValues)
    })
  }
  if (groupedTokens['releases']?.length) {

  }
  if (groupedTokens['collections']?.length) {

  }
  return filtered
}
