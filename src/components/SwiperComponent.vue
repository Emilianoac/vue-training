<script lang="ts" setup>
import { onMounted, useTemplateRef } from "vue";
import { register, type SwiperContainer } from "swiper/element/bundle";

register();
const swiperContainer = useTemplateRef("swiper-container");

const swiperParams = {
  spaceBetween: 20,
  breakpoints: {
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
    1200: { slidesPerView: 4 },
  },
};

onMounted(() => {
  if (!swiperContainer.value) return;
  const params = {
    injectStyles: [
      `
      :host(.my-swiper) .swiper-pagination {
        position: static;
      }
      :host(.my-swiper) .swiper-pagination-bullet {
        background-color: #41b883;
      }
      `
    ]
  }

  Object.assign(swiperContainer.value as HTMLElement, params);
  (swiperContainer.value as SwiperContainer).initialize();
});
</script>

<template>
  <swiper-container 
    class="mt-10 my-swiper"
    init="false"
    ref="swiper-container"
    pagination="true"
    :space-between="swiperParams.spaceBetween"
    :breakpoints="swiperParams.breakpoints">
      <slot/>
  </swiper-container>
</template>

<style lang="postcss" scoped>
  
</style>
