<script setup lang="ts">
import FilteredSearchMenu from './FilteredSearchMenu.vue'
import FilteredSearchToken from './FilteredSearchToken.vue'
import type {
  FilterCategory,
  FilterOperator,
  FilterToken,
  FilterValue,
  MenuStep, SearchMenuContext,
} from '~/types/filteredSearch'

const { categories, placeholder = 'Search or filter...' } = defineProps<{
  categories: FilterCategory[]
  placeholder?: string
}>()

const tokens = defineModel<FilterToken[]>({ default: () => [] })

// ---- Menu state machine ----
const searchValue = ref('')
const isMenuOpen = ref(false)
const menuStep = ref<MenuStep>('category')
const activeCategory = ref<FilterCategory | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const setSearch = (val: string) => searchValue.value = val
const setStep = (step: MenuStep) => menuStep.value = step
const setInputRef = (ref: HTMLInputElement | null) => searchInputRef.value = ref
const setActiveCategory = (catId: string | null) => activeCategory.value = categories.find(cat => cat.id === catId) ?? null
function openMenu() {
  console.debug('openMenu')
  isMenuOpen.value = true
}

function closeMenu() {
  console.debug('closeMenu')
  isMenuOpen.value = false
}

const selectedToken = ref<FilterToken | null>(null)
provide('selectedToken', selectedToken)

const stepOrder: MenuStep[] = ['category', 'operator', 'value']
const stepIndex = computed(() => stepOrder.indexOf(menuStep.value))
function advanceStep() {
  console.debug('advanceStep')
  const currIndex = stepIndex.value
  const nextStep = stepOrder[currIndex < stepOrder.length - 1 ? currIndex + 1 : 0]!
  setStep(nextStep)
  inputValue.value = ''
  setSearch(inputValue.value)
}

function revertStep() {
  console.debug('revertStep')
  const lastToken = tokens.value.at(-1)!
  setActiveCategory(lastToken.categoryId)
  if (menuStep.value === 'category') {
    inputValue.value = lastToken.valueLabel ?? ''
    lastToken.isComplete = false
    lastToken.valueId = undefined
    lastToken.valueLabel = undefined
  }
  else if (menuStep.value === 'value') {
    inputValue.value = lastToken.operator!
    lastToken.operator = undefined
  }
  else if (menuStep.value === 'operator') {
    inputValue.value = lastToken.categoryLabel
    removeToken(lastToken)
  }
  const currIndex = stepIndex.value
  const priorStep = stepOrder[currIndex === 0 ? stepOrder.length - 1 : currIndex - 1]!
  setStep(priorStep)
  setInputRef(inputRef.value)
  setSearch(inputValue.value)
  nextTick(updateDropdownPosition)
}

function tokenStartEdit(token: FilterToken) {
  console.debug('tokenStartEdit', token)
  selectedToken.value = token
}

function onSelectCategory(category: FilterCategory) {
  console.debug('onSelectCategory', category)
  activeCategory.value = category
  if (selectedToken.value) {
    if (selectedToken.value.categoryId !== category.id) {
      selectedToken.value.categoryId = category.id
      selectedToken.value.categoryLabel = category.label
      selectedToken.value.categoryIcon = category.icon
      selectedToken.value.operator = undefined
      selectedToken.value.valueId = undefined
      selectedToken.value.valueLabel = undefined
      selectedToken.value.isComplete = false
    }
  }
  else {
    const token: FilterToken = {
      uid: `${category.id}-${Date.now()}`,
      categoryId: category.id,
      categoryLabel: category.label,
      categoryIcon: category.icon,
      isComplete: false,
    }
    tokens.value = [...tokens.value, token]
    inputRef.value?.focus()
  }

  advanceStep()
}

function onSelectOperator(operator: FilterOperator) {
  console.debug('onSelectOperator', operator)

  if (selectedToken.value) {
    if (selectedToken.value.operator !== operator) {
      selectedToken.value.operator = operator
      selectedToken.value.valueId = undefined
      selectedToken.value.valueLabel = undefined
      selectedToken.value.isComplete = false
    }
  }
  else {
    tokens.value = tokens.value.map((t) => {
      if (t.isComplete) return t
      return {
        ...t,
        operator,
      }
    })
    inputRef.value?.focus()
  }

  advanceStep()
}

function onSelectValue(value: FilterValue) {
  console.debug('onSelectValue', value)

  if (selectedToken.value) {
    selectedToken.value.valueId = value.id
    selectedToken.value.valueLabel = value.label
    selectedToken.value.isComplete = true
    selectedToken.value = null
  }
  else {
    tokens.value = tokens.value.map((t) => {
      if (t.isComplete) return t
      return {
        ...t,
        ...{
          uid: `${t.categoryId}-${value.id}-${Date.now()}`,
          valueId: value.id,
          valueLabel: value.label,
          isComplete: true,
        },
      }
    })
    inputRef.value?.focus()
  }

  advanceStep()
}

// ----- Input & keyboard -----
const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')

function focusInput() {
  console.debug('focusInput')
  selectedToken.value = null
  nextTick(() => {
    console.debug('focusInput - set search and inputRef')
    setSearch(inputValue.value)
    inputRef.value?.focus()
    setInputRef(inputRef.value)
    openMenu()
  })
}

// Pass Up/Down/Enter Events to SearchMenu
const keyEvent = ref<KeyboardEvent | null>(null)
function onKeydown(e: KeyboardEvent) {
  // Only pass Certain events
  console.debug('onKeydown', e)
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
  revertStep()
}

function onArrowLeft(e: KeyboardEvent) {
  // Only act when cursor is at position 0 in the input
  if ((e.target as HTMLInputElement).selectionStart !== 0) return

  e.preventDefault()
  const currentIndex = selectedToken.value
    ? tokens.value.findIndex(t => t.uid === selectedToken.value!.uid)
    : tokens.value.length

  const prevIndex = currentIndex - 1
  if (prevIndex >= 0) {
    selectedToken.value = tokens.value[prevIndex]!
  }
}

function onArrowRight(e: KeyboardEvent) {
  if (!selectedToken.value) return
  if ((e.target as HTMLInputElement).selectionStart !== 0) return

  e.preventDefault()
  const currentIndex = tokens.value.findIndex(t => t.uid === selectedToken.value!.uid)
  const nextIndex = currentIndex + 1

  if (nextIndex < tokens.value.length) {
    selectedToken.value = tokens.value[nextIndex]!
  }
  else {
    selectedToken.value = null
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
function removeToken(token: FilterToken) {
  console.debug('removeToken')
  tokens.value = tokens.value.filter(t => t.uid !== token.uid)
}

function selectToken(token: FilterToken) {
  console.debug('selectToken')
  selectedToken.value = selectedToken.value?.uid === token.uid ? null : token
  focusInput()
  closeMenu()
}

function clearAll() {
  console.debug('clearAll')
  tokens.value = []
  menuStep.value = 'category'
  selectedToken.value = null
  closeMenu()
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
  console.debug('check clicked outside', containerRef.value)
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    console.debug('outside: yes')
    closeMenu()
    selectedToken.value = null
    if (menuStep.value !== 'category') {
      setStep('category')
      inputValue.value = ''
    }
    activeCategory.value = null
    if (tokens.value.some(t => !t.isComplete)) {
      tokens.value = tokens.value.filter(t => t.isComplete)
    }
  }
}

// ----- Dropdown Location x-offset -----
const dropdownLeft = ref(0)

function updateDropdownPosition() {
  console.debug('updateDropdownPosition', containerRef.value)
  if (!searchInputRef.value || !containerRef.value) return
  console.debug('update pos: yes')
  // TODO dropDownLeft isnt getting calculated correctly when container has a scrollbar
  searchInputRef.value.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  dropdownLeft.value = searchInputRef.value.offsetLeft - containerRef.value.scrollLeft
}

watch([searchInputRef, tokens, isMenuOpen], (vars) => {
  console.debug('watch dropdownpos', vars)
  if (isMenuOpen.value) nextTick(updateDropdownPosition)
})

provide('searchMenuContext', {
  search: searchValue,
  setSearch: setSearch,
  step: menuStep,
  setStep: setStep,
  activeCategory: activeCategory,
  setActiveCategory: setActiveCategory,
  isOpen: isMenuOpen,
  openMenu: openMenu,
  closeMenu: closeMenu,
  searchInputRef: searchInputRef,
  setInputRef: setInputRef,
  keyEvent: keyEvent,
  emitKey: onKeydown,
} as SearchMenuContext)
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full"
  >
    <!-- The filter bar -->
    <div
      class="flex items-center gap-1 min-h-12 px-2 py-1.5 rounded-lg border border-default bg-default
             overflow-x-auto whitespace-nowrap cursor-text"
      :class="isMenuOpen ? 'ring-2 ring-primary' : 'hover:border-accented'"
      @click="focusInput"
    >
      <!-- Search icon -->
      <UIcon
        name="i-lucide-search"
        class="size-4 text-muted shrink-0 mr-0.5"
      />

      <!-- Active tokens -->
      <FilteredSearchToken
        v-for="token in tokens"
        :key="token.uid"
        :token="token"
        :selected="selectedToken?.uid === token.uid"
        @token-clicked="() => tokenStartEdit(token)"
        @remove="removeToken(token)"
      />

      <!-- Input -->
      <input
        ref="inputRef"
        v-model="inputValue"
        class="w-32 outline-none bg-transparent text-sm placeholder:text-muted"
        :placeholder="tokens.length === 0 ? placeholder : ''"
        @input="setSearch($event.target.value)"
        @focus="openMenu"
        @keydown.delete="onBackspace"
        @keydown.esc="onEscape"
        @keydown.right="onArrowRight"
        @keydown.left="onArrowLeft"
        @keydown="onKeydown"
      >

      <!-- Spacer -->
      <div class="flex-1" />

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
        <FilteredSearchMenu
          :categories="categories"
          @select-category="onSelectCategory"
          @select-operator="onSelectOperator"
          @select-value="onSelectValue"
        />
      </div>
    </Transition>
  </div>
</template>
