<script lang="ts" setup>
import type { Level } from "@/schemas/quiz.schema";
import { levelColors } from "@/utils/levelColors";

defineProps<{
  text: string;
  type?: Level;
}>();
</script>

<template>
  <span
    title="Quiz Level"
    class="block w-fit px-2 py-0.5 rounded-full first-letter:capitalize text-xs"
    :class="[type ? levelColors[type].bg : '', type ? levelColors[type].text : '']"
  >
    {{ text }}
  </span>
</template>

<style lang="postcss" scoped></style>
