<script setup lang="ts">
import {
  type FilterToken,
  getNextStep, getPriorStep,
  type MenuStep,
  type SearchMenuContext,
  type SelectedTokenContext,
} from '~/types/filteredSearch'

const { token, selected } = defineProps<{
  token: FilterToken
  selected: boolean
}>()
const tokenCopy = ref<FilterToken>({ ...token })
watch(() => token, (newToken) => {
  tokenCopy.value = { ...newToken }
})

const { step: activeStep, isOpen: menuIsOpen, openMenu, closeMenu, setStep, setSearch, setActiveCategory, setInputRef, emitKey } = inject<SearchMenuContext>('searchMenuContext')!
const { selTokenContext, setSelectedToken } = inject<SelectedTokenContext>('selectedToken')!
const [selectedToken, editTokenStep, editTokenAtStart] = selTokenContext
const isEditing = ref(false)

const categoryInput = ref<HTMLInputElement | null>(null)
const operatorInput = ref<HTMLInputElement | null>(null)
const valueInput = ref<HTMLInputElement | null>(null)
const inputStepMap: Record<MenuStep, Ref<HTMLInputElement | null>> = {
  category: categoryInput,
  operator: operatorInput,
  value: valueInput,
}

function editToken(step: MenuStep) {
  setSelectedToken(token, step)
}

// New token selected for editing!
watch([selectedToken, editTokenStep, editTokenAtStart], ([newToken, step, atStart]) => {
  console.debug('selectedToken changed!', newToken)
  if (!newToken || newToken.uid !== token.uid) {
    cancelEdit()
  }
  else if (newToken.uid === token.uid) {
    console.debug('This token adressed!', step, atStart, isEditing.value)
    // Edit this item
    isEditing.value = true
    setStep(step)
    openMenu()
    if (atStart) {
      nextTick(() => inputStepMap[step].value?.setSelectionRange(0, 0))
    }
  }
})

watch([activeStep, isEditing], ([newStep, newEditingState]) => {
  console.debug('watch: activeStep - isEditing', newStep, newEditingState)
  if (!newEditingState) return

  console.error('This mofo: ', token)
  setStep(newStep)
  if (newStep === 'category') {
    setActiveCategory(null)
    setSearch('')
  }
  else if (newStep === 'operator') {
    setActiveCategory(token.categoryId)
    setSearch(token.operator ?? '')
  }
  else {
    setActiveCategory(token.categoryId)
    setSearch(token.valueLabel ?? '')
  }
  openMenu()

  nextTick(() => {
    setInputRef(inputStepMap[newStep].value)
    inputStepMap[newStep].value?.focus()
  })
})

function cancelEdit() {
  if (isEditing.value) {
    isEditing.value = false
    tokenCopy.value = { ...token } // reset
  }
}

function onBeforeLeft(e: KeyboardEvent, step: MenuStep) {
  // Only act when most left side reached
  if ((e.target as HTMLInputElement).selectionStart !== 0) return

  e.preventDefault()
  if (step === 'category') {
    emit('beforeStartReached')
  }
  else {
    console.debug('onBeforeLeft set selectedToken', getPriorStep(step))
    setSelectedToken(token, getPriorStep(step))
  }
}

function onAfterRight(e: KeyboardEvent, step: MenuStep) {
  // Only act when most end of input reached
  const input = e.target as HTMLInputElement
  if (input.selectionStart !== input.value.length) return

  e.preventDefault()
  if (step === 'value') {
    emit('afterEndReached')
  }
  else {
    console.debug('onAfterRight set selectedToken', getNextStep(step))
    setSelectedToken(token, getNextStep(step), true)
  }
}

const emit = defineEmits<{
  remove: []
  beforeStartReached: []
  afterEndReached: []
}>()
</script>

<template>
  <div
    class="flex items-center text-sm font-medium rounded-lg transition-all select-none shrink-0 "
    :class="{ 'bg-primary/10 ring-1 ring-primary': selected }"
  >
    <input
      v-if="isEditing && activeStep === 'category'"
      ref="categoryInput"
      v-model="tokenCopy.categoryLabel"
      class="w-48 outline-none bg-default text-sm rounded-l-lg pl-2 pr-1 py-1.5"
      @click.stop
      @input="setSearch($event.target.value)"
      @keydown="emitKey"
      @keydown.left="onBeforeLeft($event, activeStep)"
      @keydown.right="onAfterRight($event, activeStep)"
    >
    <span
      v-else
      class="flex items-center bg-elevated gap-1.5 rounded-l-lg pl-2 pr-1 py-1.5"
      @click.stop="editToken('category')"
    >
      <UIcon
        v-if="token.categoryIcon"
        :name="token.categoryIcon"
        class="size-3.5"
      />
      {{ token.categoryLabel }}
    </span>

    <template v-if="token.operator">
      <input
        v-if="isEditing && activeStep === 'operator'"
        ref="operatorInput"
        v-model="tokenCopy.operator"
        class="w-48 outline-none bg-default text-sm ring-1 ring-default px-1 py-1.5"
        @click.stop
        @input="setSearch($event.target.value)"
        @keydown="emitKey"
        @keydown.left="onBeforeLeft($event, activeStep)"
        @keydown.right="onAfterRight($event, activeStep)"
      >
      <span
        v-else
        class="bg-elevated px-1 py-1.5"
        :class="token.operator === 'is not one of' ? 'text-error' : 'text-muted'"
        @click.stop="editToken('operator')"
      >
        {{ token.operator }}
      </span>
    </template>

    <template v-if="token.valueLabel">
      <input
        v-if="isEditing && activeStep === 'value'"
        ref="valueInput"
        v-model="tokenCopy.valueLabel"
        class="w-48 outline-none bg-default text-sm ring-1 ring-default px-1 py-1.5"
        @click.stop
        @input="setSearch($event.target.value)"
        @keydown="emitKey"
        @keydown.left="onBeforeLeft($event, activeStep)"
        @keydown.right="onAfterRight($event, activeStep)"
      >
      <span
        v-else
        class="bg-elevated px-1 py-1.5"
        @click.stop="editToken('value')"
      >
        {{ token.valueLabel }}
      </span>
    </template>

    <span
      v-if="token.isComplete"
      class="bg-elevated py-0.5 rounded-r-lg"
    >
      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="link"
        size="sm"
        @click.stop="emit('remove')"
      />
    </span>
  </div>
</template>
