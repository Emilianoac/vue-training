<script setup lang="ts">
import type { WithClassAsProps } from "./interface";
import { cn } from "@/lib/utils";
import { onUnmounted, ref, watch } from "vue";
import { useCarousel } from "./useCarousel";

const props = defineProps<WithClassAsProps>();
const { carouselApi } = useCarousel();

const selectedIndex = ref(0);
const scrollSnaps = ref<number[]>([]);

let removeListeners: (() => void) | undefined;

watch(
  carouselApi,
  (api) => {
    removeListeners?.();

    if (!api) {
      scrollSnaps.value = [];
      selectedIndex.value = 0;
      return;
    }

    const onSelect = () => {
      selectedIndex.value = api.selectedScrollSnap() || 0;
    };

    const onReInit = () => {
      scrollSnaps.value = api.scrollSnapList() || [];
      onSelect();
    };

    api.on("select", onSelect);
    api.on("reInit", onReInit);
    onReInit();

    removeListeners = () => {
      api.off("select", onSelect);
      api.off("reInit", onReInit);
    };
  },
  { immediate: true },
);

onUnmounted(() => {
  removeListeners?.();
});
</script>

<template>
  <div
    data-slot="carousel-dots"
    :class="cn('mt-4 flex items-center justify-center gap-2', props.class)"
  >
    <button
      v-for="(_, index) in scrollSnaps"
      :key="index"
      type="button"
      :aria-label="`Go to slide ${index + 1}`"
      :aria-current="index === selectedIndex ? 'true' : undefined"
      :class="
        cn(
          'h-2.5 w-2.5 rounded-full border-0 bg-foreground/20 transition-all cursor-pointer',
          index === selectedIndex && 'bg-primary',
        )
      "
      @click="carouselApi?.scrollTo(index)"
    />
  </div>
</template>
