<script setup lang="ts" generic="I">
import type {
  ChipFocusHandler,
  FilteredSearchContext,
  FilterTokenBase,
  FilterTokenStrategy,
  FilterValue,
  SelectableItems,
  TokenData,
  TokenStep,
} from '~/types/filteredSearch'

const { filterStrategies, placeholder = 'Search or filter...' } = defineProps<{
  filterStrategies: FilterTokenStrategy<I, any>[]
  placeholder?: string
}>()

const tokens = defineModel<TokenData<any>[]>({ default: () => [] })

// ---------------------------------------------------------------------------
// Core state — draft and editing are tracked separately so children never
// need to discriminate between them via a union type.
//
// Invariant: at most one of (draft, editingTokenData) is non-null at a time.
// ---------------------------------------------------------------------------

const searchValue = ref('')
const isMenuOpen = ref(false)
const keyEvent = ref<KeyboardEvent | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

/** Active strategy id — null means "strategy-selection mode" (no strategy chosen yet) */
const activeStratId = ref<string | null>(null)
const activeStep = ref<TokenStep<FilterTokenBase, any> | null>(null)

/** The raw partial token being operated on — single source of truth for both cases */
const workingToken = ref<Partial<FilterTokenBase> | null>(null)

/**
 * Set when editing an existing committed token.
 * null when building a new draft.
 */
const editingTokenData = ref<TokenData<FilterTokenBase> | null>(null)

/**
 * Set when the user switches strategy on an existing token.
 * On completion the new token replaces the old one at the same index.
 */
const replacingUid = ref<string | null>(null)

// ---------------------------------------------------------------------------
// Derived state
// ---------------------------------------------------------------------------

const activeStrategy = computed(() =>
  activeStratId.value
    ? filterStrategies.find(s => s.id === activeStratId.value) ?? null
    : null,
)

/** True when building a brand-new token (not editing an existing one) */
const isDraft = computed(
  () => isMenuOpen.value && activeStrategy.value !== null && editingTokenData.value === null,
)

const selectableItems = computed<SelectableItems | null>(() => {
  // No strategy chosen yet → show strategy list
  if (!activeStratId.value) {
    return {
      values: filterStrategies.map(fS => ({ id: fS.id, label: fS.label })),
      multiple: false,
      noneAllowed: false,
      anyAllowed: false,
    }
  }
  if (!activeStep.value) return null
  return activeStep.value.getSelectableItems(searchValue.value, workingToken.value ?? {})
})

// ---------------------------------------------------------------------------
// Chip focus registration — imperative focus without reactive event-bus
// ---------------------------------------------------------------------------

const chipHandlers = new Map<string, ChipFocusHandler>()

const registerChip = (uid: string, handler: ChipFocusHandler) => {
  chipHandlers.set(uid, handler)
}

const unregisterChip = (uid: string) => {
  chipHandlers.delete(uid)
}

const requestChipFocus = (uid: string, stepId: string | null, atStart = false) => {
  chipHandlers.get(uid)?.(stepId, atStart)
}

// ---------------------------------------------------------------------------
// Context actions
// ---------------------------------------------------------------------------

const setSearch = (val: string) => { searchValue.value = val }

const setActiveInput = (el: HTMLInputElement | null) => {
  searchInputRef.value = el
  nextTick(updateDropdownPosition)
}

const clearContext = () => {
  isMenuOpen.value = false
  activeStratId.value = null
  activeStep.value = null
  workingToken.value = null
  editingTokenData.value = null
  replacingUid.value = null
  searchValue.value = ''
  searchInputRef.value = inputRef.value
}

function startStrategy(stratId: string) {
  const strategy = filterStrategies.find(s => s.id === stratId)
  if (!strategy) throw new Error(`Strategy not found: ${stratId}`)

  activeStratId.value = stratId
  workingToken.value = strategy.initToken()
  editingTokenData.value = null
  activeStep.value = strategy.steps[0] ?? null
  searchValue.value = ''
  searchInputRef.value = inputRef.value
  isMenuOpen.value = true
}

const editTokenStep = (tokenData: TokenData<any>, step: TokenStep<FilterTokenBase, any>) => {
  if (!editingTokenData.value) return
  if (tokenData.immutable) return
  const strategy = filterStrategies.find(s => s.id === tokenData.stratId)
  if (!strategy) throw new Error(`Strategy not found: ${tokenData.stratId}`)

  const stepIdx = strategy.steps.findIndex(s => s.id === step.id)

  // Cascade reset from this step onward so no stale data survives
  let token: Partial<FilterTokenBase> = { ...tokenData.token }
  for (let i = stepIdx; i < strategy.steps.length; i++) {
    const s = strategy.steps[i]!
    if (s.resetFromHere) token = s.resetFromHere(token)
  }

  activeStratId.value = tokenData.stratId
  activeStep.value = step
  workingToken.value = token
  editingTokenData.value = { ...tokenData, token: token as FilterTokenBase }
  replacingUid.value = null
  searchValue.value = ''
  isMenuOpen.value = true

  nextTick(() => requestChipFocus(tokenData.token.uid, step.id, false))
}

const navigateToStep = (step: TokenStep<FilterTokenBase, any> | null, atStart = false) => {
  if (!editingTokenData.value) return
  activeStep.value = step
  searchValue.value = ''
  const uid = editingTokenData.value.token.uid
  nextTick(() => requestChipFocus(uid, step?.id ?? null, atStart))
}

const editTokenStrategy = (tokenData: TokenData<any>) => {
  if (tokenData.immutable) return
  replacingUid.value = tokenData.token.uid
  editingTokenData.value = null
  activeStratId.value = null
  activeStep.value = null
  workingToken.value = null
  searchValue.value = ''
  searchInputRef.value = inputRef.value
  isMenuOpen.value = true
  nextTick(() => inputRef.value?.focus())
}

// ---------------------------------------------------------------------------
// Selection — shared commit logic
// ---------------------------------------------------------------------------

function advanceOrCommit(updatedToken: Partial<FilterTokenBase>) {
  workingToken.value = updatedToken
  if (editingTokenData.value) {
    editingTokenData.value = { ...editingTokenData.value, token: updatedToken as FilterTokenBase }
  }

  const strategy = activeStrategy.value!
  const stepIdx = strategy.steps.findIndex(s => s.id === activeStep.value!.id)

  // More steps remaining → advance
  if (stepIdx < strategy.steps.length - 1) {
    activeStep.value = strategy.steps[stepIdx + 1]!
    searchValue.value = ''
    return
  }

  // All steps done → commit
  if (editingTokenData.value) {
    const idx = tokens.value.findIndex(t => t.token.uid === editingTokenData.value!.token.uid)
    if (idx !== -1) {
      const next = [...tokens.value]
      next[idx] = { ...editingTokenData.value, token: updatedToken as FilterTokenBase }
      tokens.value = next
    }
  }
  else {
    const completeToken = strategy.buildToken(updatedToken)
    const newEntry: TokenData<any> = { token: completeToken, stratId: strategy.id }

    if (replacingUid.value) {
      // Replace in-place at the original index — preserves token order
      const idx = tokens.value.findIndex(t => t.token.uid === replacingUid.value)
      const next = [...tokens.value]
      if (idx !== -1) next[idx] = newEntry
      else next.push(newEntry)
      tokens.value = next
    }
    else {
      tokens.value = [...tokens.value, newEntry]
    }
  }

  clearContext()
}

const confirmSingleSelection = (value: FilterValue) => {
  // No strategy yet → this is a strategy selection
  if (!activeStratId.value) {
    startStrategy(value.id)
    return
  }
  if (!activeStep.value || workingToken.value === null) return

  const updated = activeStep.value.onSelect(value, workingToken.value)
  advanceOrCommit(updated)
}

const confirmMultiSelection = (values: FilterValue[]) => {
  if (!activeStep.value || workingToken.value === null || values.length === 0) return

  const step = activeStep.value
  const updated = step.onMultiSelect
    ? step.onMultiSelect(values, workingToken.value)
    : step.onSelect(values[0]!, workingToken.value)
  advanceOrCommit(updated)
}

// ---------------------------------------------------------------------------
// Input & keyboard
// ---------------------------------------------------------------------------

function onContainerClick() {
  // If input is already focused just open menu; avoid toggle flicker
  if (document.activeElement !== inputRef.value) {
    inputRef.value?.focus()
  }
  else if (!isMenuOpen.value) {
    isMenuOpen.value = true
  }
}

function onInputFocus() {
  isMenuOpen.value = true
}

function onKeydown(e: KeyboardEvent) {
  if (!isMenuOpen.value) return
  if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
    e.preventDefault()
    keyEvent.value = e
  }
}

function onBackspace(e: KeyboardEvent) {
  if (searchValue.value) return
  e.preventDefault()
  // TODO: revert step or pop last token
}

function onArrowLeft(e: KeyboardEvent) {
  if ((e.target as HTMLInputElement).selectionStart !== 0) return
  if (tokens.value.length === 0) return
  e.preventDefault()
  const candidates = replacingUid.value
    ? tokens.value.filter(t => t.token.uid !== replacingUid.value)
    : tokens.value
  const last = candidates.at(-1)
  if (last) requestChipFocus(last.token.uid, 'last', false)
}

function onEscape() {
  clearContext()
  inputRef.value?.blur()
}

// Token → token navigation (called by chip events)
function editPriorToken() {
  if (!editingTokenData.value || tokens.value.length === 0) return
  const idx = tokens.value.findIndex(t => t.token.uid === editingTokenData.value!.token.uid)
  if (idx <= 0) return
  const prior = tokens.value[idx - 1]!
  clearContext()
  nextTick(() => requestChipFocus(prior.token.uid, 'last', false))
}

function editNextToken() {
  if (!editingTokenData.value) return
  const idx = tokens.value.findIndex(t => t.token.uid === editingTokenData.value!.token.uid)
  if (idx < tokens.value.length - 1) {
    const next = tokens.value[idx + 1]!
    clearContext()
    nextTick(() => requestChipFocus(next.token.uid, 'first', true))
  }
  else {
    clearContext()
    nextTick(() => inputRef.value?.focus())
  }
}

// ---------------------------------------------------------------------------
// Token management
// ---------------------------------------------------------------------------

function removeToken(tokenData: TokenData<any>) {
  if (tokenData.immutable) return
  tokens.value = tokens.value.filter(t => t.token.uid !== tokenData.token.uid)
}

const mutableTokens = computed(() => tokens.value.filter(t => !t.immutable))
function clearAll() {
  tokens.value = tokens.value.filter(t => t.immutable)
  clearContext()
}

function isSelectedToken(tokenData: TokenData<any>): boolean {
  return editingTokenData.value?.token.uid === tokenData.token.uid
}

// ---------------------------------------------------------------------------
// Click outside
// ---------------------------------------------------------------------------

const containerRef = ref<HTMLElement | null>(null)

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    clearContext()
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

// ---------------------------------------------------------------------------
// Dropdown x-offset
// ---------------------------------------------------------------------------

const dropdownLeft = ref(0)

function updateDropdownPosition() {
  if (!searchInputRef.value || !containerRef.value) return
  searchInputRef.value.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  dropdownLeft.value = searchInputRef.value.offsetLeft - containerRef.value.scrollLeft
}

watch(searchInputRef, () => nextTick(updateDropdownPosition))
watch(() => tokens.value.length, () => nextTick(updateDropdownPosition))

// ---------------------------------------------------------------------------
// Provide context
// ---------------------------------------------------------------------------

provide('filteredSearchContext', {
  search: searchValue,
  step: activeStep,
  activeStrategy,
  activeToken: workingToken,
  isOpen: isMenuOpen,
  searchInputRef,
  selectableItems,
  keyEvent,
  registerChip,
  unregisterChip,
  setSearch,
  emitKey: onKeydown,
  setActiveInput,
  editTokenStep,
  navigateToStep,
  editTokenStrategy,
  clearContext,
  confirmSingleSelection,
  confirmMultiSelection,
} satisfies FilteredSearchContext<I>)
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full"
  >
    <!-- Filter bar -->
    <div
      class="flex flex-row items-start justify-between gap-1 min-h-12 px-2 py-1.5 rounded-lg border border-default bg-default cursor-text"
      :class="isMenuOpen ? 'ring-2 ring-primary' : 'hover:border-accented'"
      @click="onContainerClick"
    >
      <UIcon
        name="i-lucide-search"
        class="size-4 text-muted shrink-0 ml-0.5 mt-2"
      />

      <div class="flex flex-row flex-start flex-1 flex-wrap items-center gap-1">
        <!--
          Iterate over the committed tokens array.
          When a token's strategy is being replaced, show the draft chip
          in its exact position to preserve visual order.
        -->
        <template
          v-for="tokenData in tokens"
          :key="tokenData.token.uid"
        >
          <FilteredSearchDraftChip
            v-if="replacingUid === tokenData.token.uid && isDraft"
          />
          <FilteredSearchToken2
            v-else
            :token-data="tokenData"
            :strategies="filterStrategies"
            :selected="isSelectedToken(tokenData)"
            @remove="removeToken(tokenData)"
            @before-start-reached="editPriorToken"
            @after-end-reached="editNextToken"
          />
        </template>

        <!-- Draft chip for new tokens (appended at end) -->
        <FilteredSearchDraftChip v-if="isDraft && !replacingUid" />

        <!-- Main search input -->
        <input
          ref="inputRef"
          v-model="searchValue"
          class="w-32 outline-none bg-transparent text-sm placeholder:text-muted mt-1.5"
          :placeholder="tokens.length === 0 && !isDraft ? placeholder : ''"
          @focus="onInputFocus"
          @click.stop
          @keydown.delete="onBackspace"
          @keydown.esc.prevent="onEscape"
          @keydown.left="onArrowLeft"
          @keydown="onKeydown"
        >
      </div>

      <UButton
        v-if="mutableTokens.length > 0"
        icon="i-lucide-x"
        color="neutral"
        variant="link"
        size="md"
        class="pl-0"
        @click.stop="clearAll"
      />
    </div>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isMenuOpen"
        class="absolute top-full z-50 mt-1 rounded-lg border border-default bg-default shadow-lg overflow-hidden"
        :style="{ left: `${dropdownLeft}px` }"
      >
        <FilteredSearchMenu2 />
      </div>
    </Transition>
  </div>
</template>
