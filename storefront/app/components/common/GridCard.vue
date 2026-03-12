<script setup lang="ts">

</script>

<template>
  <UCard
    :variant="'subtle'"
    :ui="{ root: '', body: 'p-0 sm:p-0', footer: 'p-2 sm:px-2' }"
  >
    <slot name="default" />

    <template #footer>
      <div class="flex flex-col gap-2">
        <slot name="footer" />
      </div>
    </template>
  </UCard>
</template>

<style scoped>

</style>
