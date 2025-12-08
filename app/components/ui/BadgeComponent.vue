<script lang="ts" setup>
  import { levelColors } from "@/utils/levelColors";

  defineProps<{
    text: string;
    type?: "basic" | "intermediate" | "advanced";
  }>();
</script>

<template>
  <span 
    title="Quiz Level"
    class="block w-fit px-3 py-1 rounded-full text-xs font-semibold"
    :class="[type ? levelColors[type].bg : '', type ? levelColors[type].text : '']">
      {{ text }}
  </span>
</template>

<style lang="postcss" scoped>
  
</style>
