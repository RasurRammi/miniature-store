<script setup lang="ts">
const { title, collapsible = true, initialState = false } = defineProps<{ title?: string, collapsible?: boolean, initialState?: boolean }>()

const isOpen = ref(initialState)
</script>

<template>
  <UCollapsible
    v-model:open="isOpen"
    class="border border-default rounded-xl"
    :ui="{ content: '@container' }"
    :disabled="!collapsible"
  >
    <div
      class="flex justify-between items-center rounded-xl p-4 bg-muted transition-colors"
      :class="collapsible ? 'cursor-pointer ' : ''"
    >
      <div class="flex items-center gap-2 h-6">
        <UIcon
          v-if="collapsible"
          :name="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          class="size-6"
        />
        <slot name="header">
          <span class="font-bold">{{ title }}</span>
        </slot>
      </div>
      <div>
        <slot name="actions" />
      </div>
    </div>

    <template #content>
      <div
        class="grid grid-cols-1 gap-4 @xl:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @7xl:grid-cols-7"
        :class="(!isOpen && !collapsible) ? 'p-0' : 'p-4'"
      >
        <slot />
      </div>
    </template>
  </UCollapsible>
</template>

<style scoped>

</style>
