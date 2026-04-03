<script setup lang="ts">
import { ref } from "vue";

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
      class="flex items-center px-4 h-16 rounded-lg bg-muted transition-colors"
      :class="collapsible ? 'cursor-pointer ' : ''"
    >
      <div class="flex-1 truncate min-w-0 flex items-center gap-2 h-6 ">
        <UIcon
          v-if="collapsible"
          :name="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          class="size-6"
        />
        <slot name="header">
          <span class="font-bold">{{ title }}</span>
        </slot>
      </div>
      <div class="flex gap-2 shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <template #content>
      <div
        v-if="$slots['default']"
        class="grid grid-cols-1 gap-4 @xl:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @5xl:grid-cols-5 @6xl:grid-cols-6 @7xl:grid-cols-7"
        :class="(!isOpen && !collapsible) ? 'p-0' : 'p-4'"
      >
        <slot />
      </div>

      <slot
        v-if="!$slots['default']"
        name="empty"
      />
    </template>
  </UCollapsible>
</template>

<style scoped>

</style>
