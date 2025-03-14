<script lang="ts" setup>
  import { levelColors } from "@/utils/levelColors";

  defineProps<{
    text: string;
    type?: "easy" | "medium" | "hard";
  }>();
</script>

<template>
  <span 
    title="Quiz Level"
    class="block w-fit px-2 py-1 rounded-full text-xs font-bold"
    :class="[type ? levelColors[type].bg : '', type ? levelColors[type].text : '']">
      {{ text }}
  </span>
</template>

<style lang="postcss" scoped>
  
</style>
