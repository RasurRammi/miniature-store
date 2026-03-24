<script setup lang="ts">
import { useReleaseDrawerStore } from '~/stores/releaseDrawer'
import { useAdminUser } from '~/composables/admin/useAdminUser'

const releaseDrawer = useReleaseDrawerStore()
const { data: adminUser } = await useAdminUser()
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
        v-if="releaseDrawer.isOpen && releaseDrawer.release"
        :release="releaseDrawer.release"
        :can-edit="true"
      />
      <ReleaseInfo
        v-else-if="releaseDrawer.isOpen"
        :release="releaseDrawer.release"
        :can-edit="!!adminUser"
      />
    </template>
  </USlideover>
</template>

<style scoped>

</style>
