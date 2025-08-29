<script setup lang="ts">
import { ref, watch } from "vue";
import { useTopLoader } from "../../composables/useTopLoader";

const { loading, progress } = useTopLoader();
const show = ref(false);

watch(loading, (newVal) => {
  if (newVal) {
    show.value = true; 
  } else {
    setTimeout(() => {
      show.value = false;
    }, 500);
  }
});
</script>

<template>
  <div
    v-if="loading || show"
    class="top-loader"
    :style="{
      width: `${progress}%`,
      opacity: show ? 1 : 0,
    }"
  >
  </div>
</template>

<style lang="postcss">
.top-loader {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  transition: width 0.2s ease-out, opacity 0.5s ease-in-out;
  z-index: 9999;
  @apply bg-color-primary;
}
</style>
