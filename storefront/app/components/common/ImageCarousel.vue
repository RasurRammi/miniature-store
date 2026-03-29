<script setup lang="ts">
import type { Asset } from '~/types/fragmentAliases'

const { images } = defineProps<{
  images: Asset[]
}>()

const carouselVertical = useTemplateRef('carouselVertical')
const carouselHorizontal = useTemplateRef('carouselHorizontal')
const activeIndex = ref(0)

function onClickPrev() {
  const newIndex = activeIndex.value - 1
  if (newIndex < 0) return
  select(newIndex)
}

function onClickNext() {
  const newIndex = activeIndex.value + 1
  if (newIndex >= images.length) return
  select(newIndex)
}
function onSelect(index: number) {
  activeIndex.value = index
}

function select(index: number) {
  activeIndex.value = index

  carouselVertical.value?.emblaApi?.scrollTo(index)
  carouselHorizontal.value?.emblaApi?.scrollTo(index)
}
</script>

<template>
  <div class="@container flex flex-col @lg:flex-row gap-2">
    <!-- Main Image -->
    <div class="aspect-square self-center w-full rounded-xl overflow-hidden bg-muted border border-default">
      <img
        v-if="images.length > 0 && images[activeIndex]?.source"
        :src="images[activeIndex]!.source"
        :alt="images[activeIndex]!.name"
        class="w-full h-full object-cover"
      >
      <span
        v-else
        class="aspect-square w-full flex items-center justify-center"
      >
        <UIcon
          name="i-lucide-image"
          class="size-32 text-muted"
        />
      </span>
    </div>

    <!-- Horizontal carousel — visible only when narrow -->
    <div
      v-if="images.length > 1"
      class="w-full h-24 flex flex-row @lg:hidden gap-1 justify-start items-center"
    >
      <UButton
        icon="i-lucide-chevron-left"
        variant="ghost"
        class="px-0"
        :disabled="activeIndex <= 0"
        @click="onClickPrev"
      />
      <UCarousel
        ref="carouselHorizontal"
        v-slot="{ item, index }"
        :items="images"
        orientation="horizontal"
        class="flex-1 min-w-0"
        :ui="{
          item: 'basis-auto w-24 h-24 shrink-0',
          container: 'w-full p-1 gap-1',
        }"
        @select="onSelect"
      >
        <div
          class="aspect-square h-24 w-24 rounded-lg bg-muted overflow-hidden cursor-pointer ring-2 transition-all"
          :class="index === activeIndex ? 'ring-primary' : 'ring-transparent'"
          @click="select(index)"
        >
          <img
            :src="item.preview"
            class="object-cover"
            loading="lazy"
            :alt="item.name"
          >
        </div>
      </UCarousel>
      <UButton
        icon="i-lucide-chevron-right"
        variant="ghost"
        class="px-0"
        :disabled="activeIndex >= images.length - 1"
        @click="onClickNext"
      />
    </div>

    <!-- Vertical  carousel — visible only when wide -->
    <div
      v-if="images.length > 1"
      class="w-24 hidden @lg:flex flex-col gap-1 items-center self-stretch"
    >
      <UButton
        icon="i-lucide-chevron-up"
        variant="ghost"
        class="py-0"
        :disabled="activeIndex <= 0"
        @click="onClickPrev"
      />
      <UCarousel
        ref="carouselVertical"
        v-slot="{ item, index }"
        class="flex-1 min-h-0"
        :items="images"
        orientation="vertical"
        :ui="{
          viewport: 'h-full',
          item: 'basis-auto w-24 h-24 shrink-0',
          container: 'h-full p-1 gap-1',
        }"
        @select="onSelect"
      >
        <div
          class="aspect-square w-24 h-24 rounded-lg bg-muted overflow-hidden cursor-pointer ring-2 transition-all"
          :class="index === activeIndex ? 'ring-primary' : 'ring-transparent'"
          @click="select(index)"
        >
          <img
            :src="item.preview"
            class="object-cover"
            loading="lazy"
            :alt="item.name"
          >
        </div>
      </UCarousel>
      <UButton
        icon="i-lucide-chevron-down"
        variant="ghost"
        class="py-0"
        :disabled="activeIndex >= images.length - 1"
        @click="onClickNext"
      />
    </div>
  </div>
</template>
