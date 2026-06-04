<script lang="ts" setup>
import type { Item, ItemType } from "@/schemas/learningPath.schema";
import { ArrowRightIcon, CheckCircleIcon } from "lucide-vue-next";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import ChipComponent from "@/components/ui/ChipComponent.vue";
import IconTerminal from "@/components/assets/icons/IconTerminal.vue";
import IconQuiz from "@/components/assets/icons/IconQuiz.vue";
import IconBook from "@/components/assets/icons/IconBook.vue";

defineProps<{
  item: Item;
  isCompleted: boolean;
  path: string;
}>();

const iconMap = {
  quiz: IconQuiz,
  challenge: IconTerminal,
  lesson: IconBook,
  tip: IconBook,
};

function getIcon(type: ItemType) {
  return iconMap[type] || IconBook;
}
</script>

<template>
  <Card class="p-0 relative" :class="{ 'border-green-500 dark:border-green-600': isCompleted }">
    <div
      v-if="isCompleted"
      class="absolute -top-2 -right-2 size-8 rounded-full border-4 border-background flex items-center justify-center text-white z-99"
      :class="isCompleted ? 'bg-green-500' : 'bg-muted-foreground'"
    >
      <CheckCircleIcon class="size-4" />
    </div>
    <NuxtLink
      :to="path"
      :external="item.type === 'challenge'"
      class="group rounded-md h-full flex flex-col py-4 gap-5 transition-colors duration-200 hover:opacity-90"
    >
      <CardHeader class="mb-0">
        <div class="flex items-center justify-between gap-2 text-sm font-medium">
          <div class="flex items-center justify-center size-10 rounded-full bg-background">
            <component :is="getIcon(item.type)" class="size-4" />
          </div>
        </div>

        <div class="flex items-center justify-between gap-2">
          <CardTitle class="text-base">{{ item.title }}</CardTitle>
        </div>
        <CardDescription class="line-clamp-3">{{ item.subtitle }}</CardDescription>
      </CardHeader>
      <CardFooter class="pt-0 flex flex-col items-start gap-3">
        <ChipComponent v-if="item.type !== 'lesson'" :text="item.level" :type="item.level" />

        <div class="flex gap-2 transition-all duration-300 ease-out group-hover:translate-x-1">
          <ArrowRightIcon />
        </div>
      </CardFooter>
    </NuxtLink>
  </Card>
</template>

<style lang="scss" scoped></style>
