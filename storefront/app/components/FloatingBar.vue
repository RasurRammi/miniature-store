<script setup lang="ts">
const store = useDirtyStateStore()

const emit = defineEmits<{
  save: []
  discard: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="store.totalChanges > 0"
        class="fixed bottom-12 left-1/2 -translate-x-1/2 z-99
               flex flex-1 items-center justify-between gap-6 px-4 py-3
               bg-elevated border border-primary rounded-lg shadow-xl
               whitespace-nowrap"
      >
        <span class="text-muted text-sm">
          {{ store.totalChanges }} unsaved change{{ store.totalChanges === 1 ? '' : 's' }}
        </span>

        <div class="flex flex-row items-center justify-end gap-2">
          <UButton
            color="primary"
            size="lg"
            @click="emit('save')"
          >
            Save
          </UButton>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            @click="emit('discard')"
          >
            Discard
          </UButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
