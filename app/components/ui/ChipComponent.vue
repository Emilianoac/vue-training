<script lang="ts" setup>
import type { Level } from "@/schemas/quiz.schema";
import { levelColors } from "@/utils/levelColors";

const props = defineProps<{
  text: string;
  type?: Level;
}>();

const colorClasses = computed(() => (props.type ? levelColors[props.type] : null));
</script>

<template>
  <span
    title="Quiz Level"
    class="block w-fit px-2 py-0.5 rounded-full first-letter:capitalize text-xs"
    :class="[colorClasses?.bg ?? 'bg-muted', colorClasses?.text ?? 'text-muted-foreground']"
  >
    {{ text }}
  </span>
</template>

<style lang="postcss" scoped></style>
