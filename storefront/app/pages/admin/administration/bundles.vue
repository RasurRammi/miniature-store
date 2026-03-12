<script setup lang="ts">
import GridArea from '~/components/common/GridArea.vue'

const isCreating = ref(false)

const bundleForm = {
  name: '',
}
</script>

<template>
  <div class="w-full">
    <template v-if="isCreating">
      <GridArea
        :title="bundleForm.name"
        :collapsible="false"
      >
        <UButton>Create!</UButton>
      </GridArea>
    </template>
    <template v-else>
      <UButton
        color="neutral"
        variant="ghost"
        class="w-full h-20 bg-accented m-12 rounded-2xl flex items-center justify-center gap-2 text-2xl"
      >
        <UIcon
          name="i-lucide-circle-plus"
          size="size-14"
        />
        <p>Add Release</p>
      </UButton>
    </template>
  </div>
</template>

<style scoped>

</style>
