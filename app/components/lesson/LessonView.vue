<script lang="ts" setup>
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UnwrapRefCarouselApi } from "@/components/ui/carousel/interface";

const props = defineProps<{
  lesson: Record<string, unknown>;
}>();

const currentSlide = ref(1);

const slideBlocks = computed(() => {
  const body = props.lesson.body as { value?: unknown[] } | undefined;
  const blocks = body?.value;

  if (!blocks?.length) return [];

  const slides: unknown[][] = [];
  let current: unknown[] = [];

  for (const block of blocks) {
    if ((block as unknown[])[0] === "hr") {
      if (current.length) slides.push(current);
      current = [];
    } else {
      current.push(block);
    }
  }

  if (current.length) slides.push(current);

  return slides.length ? slides : [blocks];
});

const totalSlides = computed(() => slideBlocks.value.length);

function getSlideValue(blocks: unknown[]) {
  const body = props.lesson.body as Record<string, unknown> | undefined;
  return {
    ...props.lesson,
    body: { ...body, value: blocks },
  } as Record<string, unknown>;
}

function onCarouselInit(api: UnwrapRefCarouselApi | undefined) {
  if (!api) return;

  const update = () => {
    currentSlide.value = api.selectedScrollSnap() + 1;
  };
  api.on("select", update);
  update();
}
</script>

<template>
  <div class="max-w-200 mx-auto flex flex-col gap-4">
    <div>
      <h1 class="text-2xl font-bold mb-4">{{ lesson.title as string }}</h1>
      <p>{{ lesson.description as string }}</p>
    </div>

    <div class="lesson-card overflow-hidden bg-card rounded-md">
      <Carousel
        class="lesson-carousel w-full h-full"
        :opts="{
          align: 'start',
          loop: false,
          watchDrag: false,
        }"
        @init-api="onCarouselInit"
      >
        <CarouselContent class="lesson-carousel-content h-full">
          <CarouselItem v-for="(blocks, index) in slideBlocks" :key="index" class="h-full">
            <ScrollArea class="h-full pr-4">
              <article class="lesson-slide p-5 pb-20">
                <ContentRenderer :value="getSlideValue(blocks)" />
              </article>
            </ScrollArea>
          </CarouselItem>
        </CarouselContent>

        <div class="lesson-bottom-nav">
          <div class="flex justify-between items-center gap-4 w-full">
            <CarouselPrevious variant="default" class="static! translate-0" />
            <div class="space-y-1">
              <CarouselDots class="lesson-bottom-nav__dots mt-0" />
              <p class="text-xs text-muted-foreground text-center mb-0!" aria-live="polite">
                {{ currentSlide }} / {{ totalSlides }}
              </p>
            </div>
            <CarouselNext variant="default" class="static! translate-0" />
          </div>

          <!-- Slot para acciones contextuales (ej: botón "Marcar como completado" en rutas del path) -->
          <slot name="actions" :current-slide="currentSlide" :total-slides="totalSlides" />
        </div>
      </Carousel>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lesson-card {
  position: relative;
  height: clamp(28rem, 70vh, 44rem);
}

.lesson-bottom-nav {
  position: sticky;
  left: 1rem;
  right: 1rem;
  bottom: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--card) 60%, transparent);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.12);
}

.lesson-bottom-nav__dots {
  justify-content: center;
}

.lesson-carousel {
  min-height: 0;
}

.lesson-slide {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.5rem;
}

:deep([data-slot="carousel-content"]) {
  height: 100%;
}

:deep([data-slot="carousel-content"] > div) {
  height: 100%;
  align-items: stretch;
}

:deep([data-slot="carousel-item"]) {
  height: 100%;
  min-height: 0;
}

:deep(h1) {
  font-weight: bold;
  font-size: 1.8rem;
}

:deep(h2) {
  font-weight: 700;
  font-size: 1.3rem;
  border-bottom: 5px solid var(--primary);
  margin-bottom: 2rem;
  padding-bottom: 0.25rem;
  width: fit-content;
}

:deep(h3) {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  border-left: 6px solid var(--primary);
  padding-left: 0.3rem;
  line-height: 1;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.9;

  & :last-of-type {
    margin-bottom: 0;
  }
}

:deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  padding: 1rem;
  padding-left: 2rem;

  li {
    margin-bottom: 0.5rem;
    line-height: 1.9;
  }

  & :last-of-type {
    margin-bottom: 0;
  }
}

:deep(hr) {
  margin: 2rem 0;
  border-bottom: 1px solid var(--border);
}
</style>
