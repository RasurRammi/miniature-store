<script setup lang="ts">
const { title, collapsible, initialState = false } = defineProps<{ title: string, collapsible: boolean, initialState?: boolean }>()

const isOpen = ref(initialState)
</script>

<template>
  <UCollapsible
    v-model:open="isOpen"
    class="border border-default rounded-xl"
  >
    <div
      class="flex justify-between rounded-xl p-4 cursor-pointer bg-muted transition-colors"
    >
      <div class="flex items-center  gap-2 ">
        <UIcon
          :name="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          class="size-6"
        />
        <span class="font-bold">{{ title }}</span>
      </div>
      <div>
        <slot name="actions" />
      </div>
    </div>

    <template #content>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-4">
        <slot />
      </div>
    </template>
  </UCollapsible>
</template>

<style scoped>

</style>
