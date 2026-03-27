<script setup lang="ts" generic="I">
import type {
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

// ---- Menu state machine ----
const searchValue = ref('')
const isMenuOpen = ref(false)
const menuStep = ref<TokenStep<FilterTokenBase, unknown>>()
const activeStrategy = ref<FilterTokenStrategy<I, any>>()
const selectedToken = ref<Partial<FilterTokenBase> | TokenData<any>>()
const editTokenAtStart = ref<boolean>(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
// setters
const setContext = (
  stratId: string,
  step?: TokenStep<FilterTokenBase, unknown>,
  activeToken?: Partial<FilterTokenBase> | TokenData<any>,
  sInputRef?: HTMLInputElement,
  eTokenAtStart: boolean = false,
) => {
  activeStrategy.value = filterStrategies.find(fS => fS.id === stratId)
  if (!activeStrategy.value) throw Error(`Selected Strategy could not be found: ${stratId}`)
  selectedToken.value = activeToken ? activeToken : activeStrategy.value.initToken()
  menuStep.value = step ? step : activeStrategy.value.steps[0]
  searchInputRef.value = sInputRef ? sInputRef : inputRef.value
  editTokenAtStart.value = eTokenAtStart
  isMenuOpen.value = true
}

const clearContext = () => {
  isMenuOpen.value = false
  menuStep.value = undefined
  activeStrategy.value = undefined
  selectedToken.value = undefined
  inputValue.value = ''
  searchInputRef.value = inputRef.value
}

watch(searchInputRef, () => searchValue.value = searchInputRef.value?.value ?? '')

const selectableItems = computed<SelectableItems<any> | null>(() => {
  if (!activeStrategy.value) {
    return {
      values: filterStrategies.map(fS => ({ id: fS.id, label: fS.label })),
      multiple: false,
      noneAllowed: false,
      anyAllowed: false,
    }
  }
  if (!menuStep.value) return null
  return menuStep.value.getSelectableItems(searchValue.value, selectedToken.value ?? {})
})

function menuItemSelected(fValue: FilterValue<string>) {
  if (!activeStrategy.value) {
    setContext(fValue.id)
    return
  }
  if (!menuStep.value) throw Error(`Active Strategy, but no steps selected: ${activeStrategy.value}`)
  if (!selectedToken.value) throw Error(`Step is active, but no token was selected: ${menuStep.value}`)
  selectedToken.value = menuStep.value.onSelect(fValue, selectedToken.value)
  const stepIdx = activeStrategy.value.steps.findIndex(s => s.id === menuStep.value!.id)
  if (stepIdx === -1) {
    console.error(activeStrategy.value, menuStep.value)
    throw Error(`Current Step couldn't be found in the active Strategy: ${activeStrategy.value}, ${menuStep.value}`)
  }
  if (stepIdx < activeStrategy.value.steps.length - 1) {
    menuStep.value = activeStrategy.value.steps[stepIdx + 1]
  }
  else {
    const completeToken = activeStrategy.value.buildToken(selectedToken.value!)
    tokens.value = [...tokens.value, { token: completeToken, stratId: activeStrategy.value.id }]
    clearContext()
  }
}

// ----- Input & keyboard -----
const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')

function focusInput() {
  clearContext()
  nextTick(() => {
    searchInputRef.value = inputRef.value
    inputRef.value?.focus()
    isMenuOpen.value = true
  })
}

// Pass Up/Down/Enter Events to SearchMenu
const keyEvent = ref<KeyboardEvent | null>(null)
function onKeydown(e: KeyboardEvent) {
  // Only pass Certain events
  if (!isMenuOpen.value) return
  if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
    e.preventDefault()
    keyEvent.value = e
  }
}

function onBackspace(e) {
  // Only act on backspace when input is empty
  if (inputValue.value) return

  e.preventDefault()
  // revertStep()
}

function onArrowLeft(e: KeyboardEvent) {
  // Only act when cursor is at position 0 in the input
  if ((e.target as HTMLInputElement).selectionStart !== 0) return

  console.error('onArrowLeft!!?!??!?')
  e.preventDefault()
  setSelectedToken(tokens.value.at(-1)!, 'value')
}

function editPriorToken() {
  if (tokens.value.length === 0) return
  if (!selectedToken.value) {
    setSelectedToken(tokens.value.at(-1)!, 'value', false)
  }
  else {
    const tokenIndex = tokens.value.findIndex(t => t.uid === selectedToken.value?.uid)
    if (tokenIndex <= 0) return
    setSelectedToken(tokens.value.at(tokenIndex - 1)!, 'value', false)
  }
}

function editNextToken() {
  console.error('editNextToken????')
  if (tokens.value.length === 0) return
  if (!selectedToken.value) {
    // shouldnt even occur
    setSelectedToken(tokens.value.at(0)!, 'category', true)
  }
  else {
    const tokenIndex = tokens.value.findIndex(t => t.uid === selectedToken.value?.uid)
    if (tokenIndex < tokens.value.length - 1) {
      setSelectedToken(tokens.value.at(tokenIndex + 1)!, 'category', true)
    }
    else {
      focusInput()
      setStep()
    }
  }
}

function onEscape() {
  if (isMenuOpen.value) {
    isMenuOpen.value = false
  }
  else {
    selectedToken.value = null
    inputRef.value?.blur()
  }
}

// ----- Token management -----
function removeToken(tokenData: TokenData<any>) {
  tokens.value = tokens.value.filter(t => t.token.uid !== tokenData.token.uid)
}

function clearAll() {
  tokens.value = []
  clearContext()
}

// ----- Dropdown and defocus management -----
// Close menu when clicking outside
const containerRef = ref<HTMLElement | null>(null)
onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', onClickOutside)
})
function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    clearContext()
  }
}

// ----- Dropdown Location x-offset -----
const dropdownLeft = ref(0)

function updateDropdownPosition() {
  if (!searchInputRef.value || !containerRef.value) return
  // TODO dropDownLeft isnt getting calculated correctly when container has a scrollbar
  searchInputRef.value.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  dropdownLeft.value = searchInputRef.value.offsetLeft - containerRef.value.scrollLeft
}

watch([searchInputRef, tokens, isMenuOpen], (vars) => {
  if (isMenuOpen.value) nextTick(updateDropdownPosition)
})

provide('searchMenuContext2', {
  search: searchValue,
  step: menuStep,
  activeStrategy: activeStrategy,
  activeToken: selectedToken,
  isOpen: isMenuOpen,
  searchInputRef: searchInputRef,
  selectableItems: selectableItems,
  keyEvent: keyEvent,
  emitKey: onKeydown,
  setContext: setContext,
  clearContext: clearContext,
} as FilteredSearchContext<I>)
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full"
  >
    <!-- The filter bar -->
    <div
      class="flex flex-row items-start justify-between gap-1 min-h-12 px-2 py-1.5 rounded-lg border border-default bg-default
             cursor-text"
      :class="isMenuOpen ? 'ring-2 ring-primary' : 'hover:border-accented'"
      @click="focusInput"
    >
      <!-- Search icon -->
      <UIcon
        name="i-lucide-search"
        class="size-4 text-muted shrink-0 ml-0.5 mt-2 "
      />

      <div class="flex flex-row flex-start flex-1 flex-wrap items-center gap-1">
        <!-- Active tokens -->
        <FilteredSearchToken2
          v-for="tokenData in tokens"
          :key="tokenData.token.uid"
          :token-data="tokenData"
          :strategies="filterStrategies"
          :selected="selectedToken?.uid === tokenData.token.uid"
          @remove="removeToken(tokenData)"
          @before-start-reached="editPriorToken"
          @after-end-reached="editNextToken"
        />

        <!-- Input -->
        <input
          ref="inputRef"
          v-model="inputValue"
          class="w-32 outline-none bg-transparent text-sm placeholder:text-muted mt-1.5"
          :placeholder="tokens.length === 0 ? placeholder : ''"
          @input="setSearch($event.target.value)"
          @focus="openMenu"
          @keydown.delete="onBackspace"
          @keydown.esc="onEscape"
          @keydown.right="onArrowRight"
          @keydown.left="onArrowLeft"
          @keydown="onKeydown"
        >
      </div>

      <UButton
        v-if="tokens.length > 0"
        icon="i-lucide-x"
        color="neutral"
        variant="link"
        size="md"
        class="pl-0 text-right"
        @click.stop="clearAll"
      />
    </div>

    <!-- Dropdown menu -->
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
        class="absolute top-full left-0 z-50 mt-1 rounded-lg border border-default bg-default shadow-lg overflow-hidden"
        :style="{ left: `${dropdownLeft}px` }"
      >
        <FilteredSearchMenu2
          @select-item="menuItemSelected"
        />
      </div>
    </Transition>
  </div>
</template>
