<script setup lang="ts" generic="I, T extends FilterTokenBase">
import {
  type AnyToken,
  type FilteredSearchContext,
  type FilterTokenBase,
  type FilterTokenStrategy,
  getNextStep,
  getPriorStep, isTokenData,
  type MenuStep,
  type TokenData,
  type TokenStep,
} from '~/types/filteredSearch'

const { strategies, tokenData, selected } = defineProps<{
  strategies: FilterTokenStrategy<I, any>[]
  tokenData: TokenData<any>
  selected: boolean
}>()

const { step: activeStep, emitKey, activeToken, editTokenAtStart, setContext, clearContext } = inject<FilteredSearchContext<I>>('filteredSearchContext')!
const isEditing = ref(false)
const strategy = computed(() => strategies.find(fS => fS.id === tokenData.stratId)!)

const inputRefs = ref<Map<string, HTMLInputElement>>(new Map())

function editStep(step: TokenStep<T, any>) {
  setContext(tokenData.stratId, step, tokenData, inputRefs.value.get(step.id))
  isEditing.value = true
}

watch(activeToken, (newToken: AnyToken<any>) => {
  if ((isTokenData(newToken) && newToken.token.uid !== tokenData.token.uid) || !isTokenData(newToken)) {
    console.log('cancel editing')
    cancelEdit()
  }
})

function cancelEdit() {
  if (isEditing.value) {
    isEditing.value = false
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
    // setSelectedToken(token, getPriorStep(step))
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
    // setSelectedToken(token, getNextStep(step), true)
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
      v-if="isEditing && !activeStep"
      ref="categoryInput"
      :value="strategy.label"
      class="w-48 outline-none bg-default text-sm rounded-l-lg pl-2 pr-1 py-1.5"
      @click.stop
      @input="console.log"
      @keydown="emitKey"
      @keydown.left="onBeforeLeft($event, activeStep)"
      @keydown.right="onAfterRight($event, activeStep)"
    >
    <span
      v-else
      class="flex items-center bg-elevated gap-1.5 rounded-l-lg pl-2 pr-1 py-1.5"
      @click.stop="console.log('edit Category!')"
    >
      <UIcon
        v-if="strategy.icon"
        :name="strategy.icon"
        class="size-3.5"
      />
      {{ strategy.label }}
    </span>

    <template
      v-for="step in strategy.steps"
      :key="step.id"
    >
      <input
        v-show="isEditing && activeStep.id === step.id"
        :ref="(el?: HTMLInputElement) => { if (el) inputRefs.set(step.id, el) }"
        :value="step.getTokenLabel(tokenData)"
        class="w-48 outline-none bg-default text-sm ring-1 ring-default px-1 py-1.5"
        @input="console.log"
        @click.stop
        @keydown="emitKey"
        @keydown.left="onBeforeLeft($event, activeStep)"
        @keydown.right="onAfterRight($event, activeStep)"
      >
      <span
        v-show="!isEditing || activeStep.id !== step.id"
        class="bg-elevated px-1 py-1.5"
        @click.stop="editStep(step)"
      >
        {{ step.getTokenLabel(tokenData) }}
      </span>
    </template>

    <span
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
