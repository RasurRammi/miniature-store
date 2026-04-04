<script setup lang="ts">
import { useReleaseDrawerStore } from '~/stores/releaseDrawer'
import { useUser } from '~/composables/useUser'

const releaseDrawer = useReleaseDrawerStore()
const { data: user } = await useUser()
</script>

<template>
  <USlideover
    v-model:open="releaseDrawer.isOpen"
    :ui="{ content: 'max-w-full sm:max-w-lg md:max-w-xl lg:max-w-1/2 xl:max-w-1/3' }"
    :modal="false"
    :title="''"
    :description="''"
    @after:leave="releaseDrawer.onAfterLeave"
  >
    <template #content>
      <ReleaseInfo
        v-if="releaseDrawer.isOpen"
        :release="releaseDrawer.release"
        :can-edit="!!user"
      />
    </template>
  </USlideover>
</template>

<style scoped>

</style>
