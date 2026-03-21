export type FilterOperator = 'is' | 'is one of' | 'is not one of'

export type FilterValue = {
  id: string
  label: string
}

export type FilterCategory = {
  id: string
  label: string
  icon?: string
  values: FilterValue[]
}

export type FilterToken = {
  uid: string
  categoryId: string
  categoryLabel: string
  categoryIcon?: string
  operator?: FilterOperator
  valueId?: string
  valueLabel?: string
  isComplete: boolean
}

export type MenuStep = 'category' | 'operator' | 'value'

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
