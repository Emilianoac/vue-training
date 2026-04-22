<script lang="ts" setup>
import type { Tip } from "~/schemas/tip.schema";

const props = defineProps<{
  currentTip: Tip;
  tips: Tip[];
}>();

const emit = defineEmits<{
  (e: "select-tip", tip: Tip): void;
}>();
</script>

<template>
  <ul v-if="tips.length && currentTip" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <li
      v-for="tip in tips"
      :key="tip.id"
      :class="{ 'outline-primary!': currentTip.id === tip.id }"
      class="block items-center border bg-card rounded-md p-4 cursor-pointer hover:opacity-85 hover:shadow-sm transition-all duration-200 outline outline-2 outline-transparent dark:outline-transparent"
      @click="emit('select-tip', tip)"
    >
      <div
        class="bg-gray-100 dark:bg-slate-900 rounded-md p-3 w-12 h-12 mr-4 flex items-center justify-center"
      >
        <img :src="tip.category.image.url" alt="Category Icon" />
      </div>
      <div>
        <span class="text-sm text-gray-600 dark:text-gray-300 mb-1 mt-5 lg:mt-0 block">
          {{ tip.category.name }}
        </span>
        <h4 class="font-bold mb-1">{{ tip.title }}</h4>
        <p class="text-[0.92em]">{{ tip.short_description }}</p>
      </div>
    </li>
  </ul>
</template>

<style lang="scss"></style>
