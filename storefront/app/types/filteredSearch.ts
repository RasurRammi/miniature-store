import type { Product } from '~/types/fragmentAliases'

export type FilterOperator = 'is' | 'is one of' | 'is not one of'

export type CategoryId = 'tags' | 'releases' | 'collections' | 'text'

export type FilterCategory = {
  id: CategoryId
  label: string
  icon?: string
  valueGroups: ValueGroup[]
}

export type FilterToken = {
  uid: string
  categoryId: CategoryId
  categoryLabel: string
  categoryIcon?: string
  operator?: FilterOperator
  valueId?: string | string[]
  valueLabel?: string | string[]
  isComplete: boolean
}

export type MenuStep = 'category' | 'operator' | 'value'
const stepOrder: MenuStep[] = ['category', 'operator', 'value']

export function getNextStep(currStep: MenuStep): MenuStep {
  const currIdx = stepOrder.indexOf(currStep)
  return stepOrder[currIdx < stepOrder.length - 1 ? currIdx + 1 : 0]!
}
export function getPriorStep(currStep: MenuStep): MenuStep {
  const currIdx = stepOrder.indexOf(currStep)
  return stepOrder[currIdx === 0 ? stepOrder.length - 1 : currIdx - 1]!
}

export type SearchMenuContext = {
  search: Ref<string>
  setSearch: (val: string) => void
  step: Ref<MenuStep>
  setStep: (step: MenuStep) => void
  activeCategory: Ref<FilterCategory | null>
  setActiveCategory: (catId: string | null) => void
  isOpen: Ref<boolean>
  openMenu: () => void
  closeMenu: () => void
  searchInputRef: Ref<HTMLInputElement | null>
  setInputRef: (ref: HTMLInputElement | null) => void
  keyEvent: Ref<KeyboardEvent | null>
  emitKey: (e: KeyboardEvent) => void
}

export type SelectedTokenContext = {
  selTokenContext: [Ref<FilterToken | null>, Ref<MenuStep>, Ref<boolean>]
  setSelectedToken: (token: FilterToken | null, step?: MenuStep, atStart?: boolean) => void
}

// ------ Test -----

// --- Base Structure ---
// I stands for "Item": The type of the object to be filtered by the token
// T stands for "Type": The type of the filtering object
// V stands for "Value" and defines the types a FilterValue can take (e.g. special operators or any string)

export type FilterTokenBase = {
  uid: string
}

export type AnyToken<T extends FilterTokenBase> = Partial<T> | TokenData<T>

export type TokenData<T extends FilterTokenBase> = {
  token: T
  stratId: string
}

export function isTokenData(data?: AnyToken<any>): data is TokenData<any> {
  return !!data && 'token' in data
}

export type FilterValue<V extends string = string> = {
  id: V
  label: string
}

export type ValueGroup<V = string> = {
  id: string
  label: string
  values: FilterValue<V>[]
}

export type SelectableItems<V extends string = string> = {
  values: ValueGroup<V>[] | FilterValue<V>[]
  multiple: boolean
  noneAllowed: boolean
  anyAllowed: boolean
}

export type TokenStep<T extends FilterTokenBase, V extends string = string> = {
  id: string
  getSelectableItems: (search: string, token: Partial<T>) => SelectableItems<V>
  onSelect: (value: FilterValue<V>, token: Partial<T>) => Partial<T>
  getTokenLabel: (token: TokenData<T>) => string
}

export type FilterTokenStrategy<I, T extends FilterTokenBase> = {
  id: string
  label: string
  icon?: string
  steps: TokenStep<T, any>[]
  initToken: () => Partial<T>
  buildToken: (partial: Partial<T>) => T
  filterFn: (item: I, token: T) => boolean
}

// --- Helpers

const defaultOperators: { id: FilterOperator, label: string }[] = [
  {
    id: 'is',
    label: 'is',
  }, {
    id: 'is one of',
    label: 'is one of',
  }, {
    id: 'is not one of',
    label: 'is one of',
  },
]

export type FilteredSearchContext<I> = {
  search: Ref<string>
  step: Ref<TokenStep<FilterTokenBase> | null>
  activeStrategy: Ref<FilterTokenStrategy<I, FilterTokenBase> | null>
  activeToken: Ref<Partial<FilterTokenBase> | TokenData<never>>
  isOpen: Ref<boolean>
  editTokenAtStart: Ref<boolean>
  searchInputRef: Ref<HTMLInputElement | null>
  selectableItems: Ref<SelectableItems | null>

  keyEvent: Ref<KeyboardEvent | null>
  emitKey: (e: KeyboardEvent) => void

  setContext: (
    stratId: string,
    step?: TokenStep<FilterTokenBase>,
    activeToken?: AnyToken<any>,
    searchInputRef?: HTMLInputElement,
    editTokenAtStart?: boolean,
  ) => void
  clearContext: () => void
}

// --- Explicit Implementations

export type FacetFilterToken = FilterTokenBase & {
  operator: FilterOperator
  valueId: string | string[]
  valueLabel: string | string[]
}

function filterProductByFacetToken(product: Product, token: FacetFilterToken): boolean {
  return true
}

export function getFacetFilterStrategy(): FilterTokenStrategy<Product, FacetFilterToken> {
  return {
    id: 'tags',
    label: 'Tag',
    icon: 'i-lucide-tag',
    steps: [
      {
        id: 'operator',
        getSelectableItems: () => ({
          values: defaultOperators,
          multiple: false,
          anyAllowed: false,
          noneAllowed: false,
        }),
        onSelect: (value, token) => ({ ...token, operator: value.id }),
        getTokenLabel: tokenData => tokenData.token.operator,
      },
      {
        id: 'value',
        getSelectableItems: (search, token) => ({
          values: [],
          multiple: token.operator !== 'is',
          noneAllowed: token.operator === 'is',
          anyAllowed: token.operator === 'is',
        }
        ),
        onSelect: (value, token) => ({ ...token, valueId: value.id, valueLabel: value.label }),
        getTokenLabel: tokenData => tokenData.token.valueLabel as string, // TODO could be multiple
      },
    ],
    initToken: () => ({ uid: '1' }),
    buildToken: partial => ({ ...partial } as FacetFilterToken),
    filterFn: filterProductByFacetToken,
  }
}
