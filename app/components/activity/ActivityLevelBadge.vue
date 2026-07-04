<script setup lang="ts">
import type { Level } from "@/schemas/quiz.schema";
import { levelColors } from "@/utils/levelColors";
import { Badge } from "@/components/ui/badge";

const props = defineProps<{
  text: string;
  type?: Level;
}>();

const colorClasses = computed(() => (props.type ? levelColors[props.type] : null));
</script>

<template>
  <Badge
    class="border-transparent first-letter:capitalize"
    :class="[colorClasses?.bg ?? 'bg-muted', colorClasses?.text ?? 'text-muted-foreground']"
  >
    {{ text }}
  </Badge>
</template>
