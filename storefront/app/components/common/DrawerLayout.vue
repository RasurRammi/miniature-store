<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="@container flex flex-col gap-4 p-6">
    <div class="flex flex-col gap-2">
      <!-- DrawerLayout Header -->
      <div class="flex items-center justify-between">
        <!-- Product Name -->
        <h2 class="text-xl font-bold">
          <slot name="title" />
        </h2>
        <!-- Actions -->
        <div class="flex items-center gap-1">
          <slot name="actions" />
          <UButton
            icon="i-lucide-arrow-right"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
            @click="$emit('close')"
          />
        </div>
      </div>

      <slot name="header" />
    </div>

    <div class="flex flex-col gap-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>

</style>
