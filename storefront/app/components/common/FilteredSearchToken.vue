<script setup lang="ts">
import type { FilterToken, MenuStep, SearchMenuContext } from '~/types/filteredSearch'

const { token, selected } = defineProps<{
  token: FilterToken
  selected: boolean
}>()
const tokenCopy = ref<FilterToken>({ ...token })
watch(() => token, (newToken) => {
  tokenCopy.value = { ...newToken }
})

const { step: activeStep, openMenu, closeMenu, setStep, setSearch, setActiveCategory, setInputRef, emitKey } = inject<SearchMenuContext>('searchMenuContext')!
const selectedToken = inject<Ref<FilterToken | null>>('selectedToken')!
const isEditing = ref(false)

const categoryInput = ref<HTMLInputElement | null>(null)
const operatorInput = ref<HTMLInputElement | null>(null)
const valueInput = ref<HTMLInputElement | null>(null)

watch(selectedToken, (newToken: FilterToken | null) => {
  console.debug('selectedToken changed!', newToken)
  if (!newToken || newToken.uid !== token.uid) {
    cancelEdit()
  }
})

const inputStepMap: Record<MenuStep, Ref<HTMLInputElement | null>> = {
  category: categoryInput,
  operator: operatorInput,
  value: valueInput,
}

function editToken(step: MenuStep) {
  console.debug('editToken', step)
  isEditing.value = true
  setStep(step)
  emit('tokenClicked')
  openMenu()
}

watch([activeStep, isEditing], ([newStep, newEditingState]) => {
  console.debug('watch: activeStep - isEditing', newStep, newEditingState)
  if (!newEditingState) return
  console.debug('token and token copy', token, tokenCopy.value)

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

  nextTick(() => {
    setInputRef(inputStepMap[newStep].value)
    inputStepMap[newStep].value?.focus()
  })
})

function cancelEdit() {
  console.debug('check cancelEdit')
  if (isEditing.value) {
    console.debug('cancelEdit: yes', tokenCopy.value, token)
    isEditing.value = false
    closeMenu()
    tokenCopy.value = { ...token } // reset
    setStep('category')
  }
}

const emit = defineEmits<{
  remove: []
  tokenClicked: []
}>()
// rounded-lg  px-2 py-1.5 gap-1.5
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
      class="w-32 outline-none bg-default text-sm rounded-l-lg pl-2 pr-1 py-1.5"
      @click.stop
      @input="setSearch($event.target.value)"
      @keydown="emitKey"
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
        class="w-32 outline-none bg-default text-sm ring-1 ring-default px-1 py-1.5"
        @click.stop
        @input="setSearch($event.target.value)"
        @keydown="emitKey"
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
        class="w-32 outline-none bg-default text-sm ring-1 ring-default px-1 py-1.5"
        @click.stop
        @input="setSearch($event.target.value)"
        @keydown="emitKey"
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
