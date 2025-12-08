<script lang="ts" setup>
  import { watch } from "vue";
  import emblaCarouselVue from "embla-carousel-vue";

  const [emblaRef, emblaApi] = emblaCarouselVue({align: "start"});
  const selectedIndex = ref(0);
  const scrollSnaps = ref<number[]>([]);

  defineProps<{
    items: any[];
  }>();

  watch(emblaApi, () => {
    if (!emblaApi.value) return;

    scrollSnaps.value = emblaApi.value.scrollSnapList() || [];
    const onSelect = () => selectedIndex.value = emblaApi.value?.selectedScrollSnap() || 0 ;
    emblaApi.value.on("select", onSelect);
    onSelect();
  })
</script>

<template>
  <div class="embla" ref="emblaRef">
    <div class="embla__container">
      <div  v-for="(item, i) in items" :key="i" class="embla__slide">
        <slot name="slide" :item="item" :index="i"/>
      </div>
    </div>

    <div class="embla__dots mt-4">
      <button  
        v-for="(dot, index) in scrollSnaps" 
        @click="(emblaApi?.scrollTo(index))"
        :className="`embla__dot  ${index === selectedIndex ? 'is-active' : ''} `"
        :key="dot">
      </button>
    </div>
  </div>
</template>

<style lang="postcss">

  .embla {
    overflow: hidden;
    padding: 1em 0;
    padding-right: 0.4em;
    
    &::after {
      content: '';
      flex: 0 0 1rem; 
    }
  }

  .embla__container {
    display: flex;
    gap: 2rem;

  }

  .embla__slide {
    flex: 0 0  calc(33.333% - (4rem / 3));
    min-width: 0;
  }

  .embla__dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .embla__dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--text-color);
    opacity: 0.3;
    transform: scale(0.7);
    border: none;
    cursor: pointer;
  }

  .embla__dot.is-active {
    opacity: 1;
    transform: scale(1);
  }

  @media (max-width: 1280px) {
    .embla__slide {
      flex: 0 0 calc(50% - 1rem); 
    }
  }

  @media (max-width: 750px) {
    .embla__slide {
      flex: 0 0 100%
    }
  }
</style>
