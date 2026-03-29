import type { Ref } from 'vue'

// ---------------------------------------------------------------------------
// Core token types
// I = Item being filtered (e.g. Product)
// T = Token shape (e.g. FacetFilterToken)
// V = Value type for a step's selectable items
// ---------------------------------------------------------------------------

export type FilterTokenBase = {
  uid: string
}

/** A token fully committed to the filter bar */
export type TokenData<T extends FilterTokenBase> = {
  token: T
  stratId: string
  immutable?: boolean
}

export type FilterValue<V extends string = string> = {
  id: V
  label: string
}

export type ValueGroup<V extends string = string> = {
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
  /** Single-value selection */
  onSelect: (value: FilterValue<V>, token: Partial<T>) => Partial<T>
  /** Multi-value confirmation — falls back to onSelect with first value if absent */
  onMultiSelect?: (values: FilterValue<V>[], token: Partial<T>) => Partial<T>
  /** Returns '' for unfilled fields. Works on Partial<T> so draft chips can use it too. */
  getTokenLabel: (token: Partial<T>) => string
  getLabelClass: (token: Partial<T>) => unknown
  /** Removes this step's own fields from the token. Run from edited step onward for cascade reset. */
  resetFromHere?: (token: Partial<T>) => Partial<T>
}

export type FilterTokenStrategy<I, T extends FilterTokenBase> = {
  id: string
  label: string
  icon?: string
  steps: TokenStep<T, any>[]
  initToken: () => Partial<T>
  buildToken: (partial: Partial<T>) => T
  filterFn: (item: I, token: T) => boolean | Promise<boolean>
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

/**
 * Token chips register a focus handler with the parent via registerChip.
 * The parent calls requestChipFocus to imperatively focus a chip's input.
 * stepId=null → focus the strategy-label segment
 * stepId='first' | 'last' → resolved by the chip to its first/last step
 */
export type ChipFocusHandler = (stepId: string | null, atStart: boolean) => void

export type FilteredSearchContext<I> = {
  // ---- Reactive state (read-only for children) ----
  search: Ref<string>
  step: Ref<TokenStep<FilterTokenBase, any> | null>
  activeStrategy: Ref<FilterTokenStrategy<I, FilterTokenBase> | null>
  /** Always the raw Partial<T> being operated on — no draft/edit union needed by children */
  activeToken: Ref<Partial<FilterTokenBase> | null>
  isOpen: Ref<boolean>
  /** Points at the input currently anchoring the dropdown for positioning */
  searchInputRef: Ref<HTMLInputElement | null>
  selectableItems: Ref<SelectableItems | null>
  keyEvent: Ref<KeyboardEvent | null>

  // ---- Chip registration — replaces the focusRequest ref event-bus ----
  registerChip: (uid: string, handler: ChipFocusHandler) => void
  unregisterChip: (uid: string) => void

  // ---- Actions ----
  setSearch: (val: string) => void
  emitKey: (e: KeyboardEvent) => void
  setActiveInput: (el: HTMLInputElement | null) => void

  /**
   * Begin editing a committed token at a specific step.
   * Cascades resetFromHere for that step and all subsequent ones.
   */
  editTokenStep: (tokenData: TokenData<any>, step: TokenStep<FilterTokenBase, any>) => void

  /**
   * Move focus to a different step within the currently-editing token.
   * Does NOT reset — used only for arrow-key traversal.
   * Pass null to navigate to the strategy-label segment.
   */
  navigateToStep: (step: TokenStep<FilterTokenBase, any> | null, atStart?: boolean) => void

  /** Enters strategy-selection mode for a committed token; replaces it in-place on completion. */
  editTokenStrategy: (tokenData: TokenData<any>) => void

  clearContext: () => void

  /** Called by the menu for single-value steps or None/Any instant-selects */
  confirmSingleSelection: (value: FilterValue) => void
  /** Called by the menu's Apply button for multi-select confirmation */
  confirmMultiSelection: (values: FilterValue[]) => void
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function isValueGroupArray<V extends string>(
  values: ValueGroup<V>[] | FilterValue<V>[],
): values is ValueGroup<V>[] {
  return values.length > 0 && 'values' in values[0]!
}
