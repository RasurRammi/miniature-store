export type FilterOperator = 'is' | 'is one of' | 'is not one of'

export type FilterValue = {
  id: string
  label: string
}

export type CategoryId = 'tags' | 'releases' | 'collections' | 'text'

export type FilterCategory = {
  id: CategoryId
  label: string
  icon?: string
  valueGroups: ValueGroup[]
}

export type ValueGroup = {
  id: string
  label: string
  values: FilterValue[]
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

// -- Test

export type TokenStep<T extends { uid: string }> = {
  id: string
  getSelectableItems: (search: string, token: Partial<T>) => { values: FilterValue[], multiple: boolean }
  onSelect: (value: FilterValue, token: Partial<T>) => Partial<T>
  // is this step complete? determines whether to advance
  isComplete?: (token: Partial<T>) => boolean
}

export type FilterTokenStrategy<T extends { uid: string }> = {
  id: string
  label: string
  icon?: string
  steps: TokenStep<T>[]
  onThisStrategySelected: () => void
  buildToken: (partial: Partial<T>) => T
  getChipLabel: (token: T) => string
}

const defaultOperators = [
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
type FacetFilterToken = {
  uid: string
  operator: FilterOperator
  valueId: string | string[]
  valueLabel: string | string[]
}
export function FacetFilterStrategy(): FilterTokenStrategy<FacetFilterToken> {
  return {
    id: 'tags',
    label: 'Tag',
    icon: 'i-lucide-tag',
    steps: [
      {
        id: 'operator',
        getSelectableItems: (search, token) => ({ values: defaultOperators, multiple: false }),
        onSelect: (value, token) => token,
        isComplete: token => false,
      },
      {
        id: 'value',
        getSelectableItems: (search, token) => ({ values: [], multiple: token.operator !== 'is' }),
        onSelect: (value, token) => token,
        isComplete: token => false,
      },
    ],
    onThisStrategySelected: () => console.log('tags selected!'),
    buildToken: partial => ({ uid: 'tags', operator: 'is', valueId: 'tags', valueLabel: 'Tags' }),
    getChipLabel: (token) => 'Tag',
  }
}
