import type { FilterTokenStrategy, TokenData } from '~/types/filteredSearch'
import type {Product} from "~/types/fragmentAliases";

export function filterProducts(
  products: Product[],
  filterTokens: TokenData<any>[],
  strategies: FilterTokenStrategy<Product, any>[],
): Product[] {
  return products.filter((product) => {
    for (const token of filterTokens) {
      const strategy = strategies.find(strat => strat.id === token.stratId)
      const res = strategy?.filterFn(product, token.token)
      if (!res) return false
    }
    return true
  })
}
