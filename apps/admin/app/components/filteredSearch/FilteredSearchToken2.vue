<script setup lang="ts" generic="I">
import type { FilteredSearchContext, FilterTokenStrategy, TokenData } from '~/types/filteredSearch'

const { strategies, tokenData, selected } = defineProps<{
  strategies: FilterTokenStrategy<I, any>[]
  tokenData: TokenData<any>
  selected: boolean
}>()

const emit = defineEmits<{
  remove: []
  beforeStartReached: []
  afterEndReached: []
}>()

const {
  step: activeStep,
  emitKey,
  registerChip,
  unregisterChip,
  setSearch,
  setActiveInput,
  editTokenStep,
  navigateToStep,
  editTokenStrategy,
} = inject<FilteredSearchContext<I>>('filteredSearchContext')!

const strategy = computed(() => strategies.find(fS => fS.id === tokenData.stratId)!)

// Input refs — populated by :ref callbacks
const categoryInputRef = ref<HTMLInputElement | null>(null)
const inputRefs = new Map<string, HTMLInputElement>()

function focusInput(el: HTMLInputElement | null | undefined, atStart: boolean) {
  if (!el) return
  nextTick(() => {
    el.focus()
    const pos = atStart ? 0 : el.value.length
    el.setSelectionRange(pos, pos)
    setActiveInput(el)
  })
}

// Register focus handler with parent so it can drive keyboard navigation imperatively
onMounted(() => {
  registerChip(tokenData.token.uid, (stepId, atStart) => {
    if (stepId === null) {
      // Strategy-label segment
      focusInput(categoryInputRef.value, atStart)
      setActiveInput(categoryInputRef.value)
    }
    else if (stepId === 'first') {
      // Arrow-right into chip from the left → land on strategy label
      focusInput(categoryInputRef.value, atStart)
      setActiveInput(categoryInputRef.value)
    }
    else if (stepId === 'last') {
      // Arrow-left into chip from the right → land on last step
      const lastStep = strategy.value.steps.at(-1)
      const inputRef = lastStep ? inputRefs.get(lastStep.id)! : categoryInputRef.value
      focusInput(inputRef, atStart)
      setActiveInput(inputRef)
    }
    else {
      focusInput(inputRefs.get(stepId), atStart)
      setActiveInput(inputRefs.get(stepId)!)
    }
  })
})

onUnmounted(() => {
  unregisterChip(tokenData.token.uid)
})

// ---------------------------------------------------------------------------
// Arrow key navigation within this chip
// Both handlers delegate to context so no navigation logic lives in the chip.
// ---------------------------------------------------------------------------

function onBeforeLeft(e: KeyboardEvent) {
  if ((e.target as HTMLInputElement).selectionStart !== 0) return
  e.preventDefault()

  if (!activeStep.value) {
    // At strategy-label segment — can't go further left
    emit('beforeStartReached')
    return
  }

  const steps = strategy.value.steps
  const idx = steps.findIndex(s => s.id === activeStep.value!.id)

  if (idx <= 0) {
    // First step → go back to strategy label (no reset)
    navigateToStep(null, false)
  }
  else {
    navigateToStep(steps[idx - 1]!, false)
  }
}

function onAfterRight(e: KeyboardEvent) {
  const input = e.target as HTMLInputElement
  if (input.selectionStart !== input.value.length) return
  e.preventDefault()

  const steps = strategy.value.steps

  if (!activeStep.value) {
    // At strategy label → move to first step (no reset)
    if (steps[0]) navigateToStep(steps[0], true)
    return
  }

  const idx = steps.findIndex(s => s.id === activeStep.value!.id)
  if (idx >= steps.length - 1) {
    emit('afterEndReached')
  }
  else {
    navigateToStep(steps[idx + 1]!, true)
  }
}
</script>

<template>
  <div
    class="flex items-center text-sm font-medium rounded-lg transition-all select-none shrink-0"
    :class="{ 'bg-primary/10 ring-1 ring-primary': selected }"
  >
    <!-- Strategy / category segment -->
    <input
      v-show="!tokenData.immutable && selected && !activeStep"
      ref="categoryInputRef"
      :value="strategy.label"
      class="w-48 outline-none bg-default text-sm rounded-l-lg pl-2 pr-1 py-1.5"
      @click.stop
      @input="setSearch($event.target.value)"
      @keydown="emitKey"
      @keydown.left.stop="onBeforeLeft"
      @keydown.right.stop="onAfterRight"
    >
    <span
      v-show="tokenData.immutable || !selected || !!activeStep"
      class="flex items-center bg-elevated gap-1.5 rounded-l-lg pl-2 pr-1 py-1.5 transition-colors"
      :class="{ 'cursor-pointer hover:bg-accented': !tokenData.immutable }"
      @click.stop="editTokenStrategy(tokenData)"
    >
      <UIcon
        v-if="strategy.icon"
        :name="strategy.icon"
        class="size-3.5"
      />
      {{ strategy.label }}
    </span>

    <!-- Step segments -->
    <template
      v-for="(step, stepIdx) in strategy.steps"
      :key="step.id"
    >
      <input
        v-show="selected && activeStep?.id === step.id"
        :ref="(el?: HTMLInputElement) => { if (el) inputRefs.set(step.id, el) }"
        :value="step.getTokenLabel(tokenData.token)"
        class="w-48 outline-none bg-default text-sm ring-1 ring-default px-1 py-1.5"
        :class="step.getLabelClass(tokenData.token)"
        @click.stop
        @input="setSearch($event.target.value)"
        @keydown="emitKey"
        @keydown.left.stop="onBeforeLeft"
        @keydown.right.stop="onAfterRight"
      >
      <span
        v-show="!selected || activeStep?.id !== step.id"
        class="bg-elevated px-1 py-1.5 transition-colors"
        :class="[
          step.getLabelClass(tokenData.token),
          { 'cursor-pointer hover:bg-accented': !tokenData.immutable },
          { 'rounded-r-lg pr-2': tokenData.immutable && stepIdx === strategy.steps.length - 1 },
        ]"
        @click.stop="editTokenStep(tokenData, step)"
      >
        {{ step.getTokenLabel(tokenData.token) }}
      </span>
    </template>

    <!-- Remove -->
    <span class="bg-elevated py-0.5 rounded-r-lg">
      <UButton
        v-if="!tokenData.immutable"
        icon="i-lucide-x"
        color="neutral"
        variant="outline"
        size="sm"
        class="ring-default bg-elevated hover:bg-accented "
        @click.stop="emit('remove')"
      />
    </span>
  </div>
</template>
