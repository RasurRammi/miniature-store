<script setup lang="ts" generic="I">
import type { FilteredSearchContext } from '~/types/filteredSearch'

// Renders while a new draft token is being built (activeToken is a partial, not TokenData).
// Shows: strategy label + already-filled step labels + cursor for the active step.

const { activeStrategy, activeToken, step: activeStep } = inject<FilteredSearchContext<I>>('filteredSearchContext')!

// Steps that come before the active step and already have a filled label
const filledSteps = computed(() => {
  if (!activeStrategy.value || !activeToken.value || !activeStep.value) return []
  const steps = activeStrategy.value.steps
  const activeIdx = steps.findIndex(s => s.id === activeStep.value!.id)
  return steps
    .slice(0, activeIdx)
    .filter(s => s.getTokenLabel(activeToken.value!).trim() !== '')
})
</script>

<template>
  <div
    v-if="activeStrategy"
    class="flex items-center text-sm font-medium rounded-lg select-none shrink-0 ring-1 ring-primary/50"
  >
    <!-- Strategy label -->
    <span class="flex items-center bg-elevated gap-1.5 rounded-l-lg pl-2 pr-1 py-1.5 text-muted">
      <UIcon
        v-if="activeStrategy.icon"
        :name="activeStrategy.icon"
        class="size-3.5"
      />
      {{ activeStrategy.label }}
    </span>

    <!-- Already-filled steps -->
    <span
      v-for="step in filledSteps"
      :key="step.id"
      class="bg-elevated border-l border-default px-1 py-1.5 text-muted"
    >
      {{ step.getTokenLabel(activeToken ?? {}) }}
    </span>

    <!-- Cursor indicator for the active (currently-typing) step -->
    <span class="bg-elevated rounded-r-lg border-l border-default pr-2.5 pl-1 py-1.5 flex items-center">
      <span class="inline-block w-0.5 h-4.5 bg-primary rounded-sm animate-pulse" />
    </span>
  </div>
</template>
