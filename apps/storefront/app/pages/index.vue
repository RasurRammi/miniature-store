<script setup lang="ts">
</script>

<template>
  <UContainer>
    <div class="flex flex-row mt-8 gap-2">
      <div class="w-3/4 flex flex-col items-center gap-4">
        <NewsCard
          v-for="i in 3"
          :key="i"
        />
      </div>
      <div class="w-1/4">
        <div class="bg-elevated rounded-lg p-2">
          Irgendwas anderes
        </div>
      </div>
    </div>
  </UContainer>
</template>
