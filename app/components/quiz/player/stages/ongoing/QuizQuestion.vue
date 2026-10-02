<script lang="ts" setup>
import useMarkdownParser from "@/composables/useMarkdownParser";
import QuizTypewriterText from "./QuizTypewriterText.vue";

const { parse } = useMarkdownParser();

const props = defineProps<{
  text: string;
}>();

const parsedQuestion = computed(() => parse(props.text));
</script>

<template>
  <div class="overflow-hidden rounded-lg border bg-zinc-950 shadow-lg shadow-black/20">
    <div class="flex items-center gap-2 border-b bg-card px-3 py-2 font-mono">
      <div class="flex gap-1.5" aria-hidden="true">
        <span class="size-2.5 rounded-full bg-red-400"></span>
        <span class="size-2.5 rounded-full bg-amber-300"></span>
        <span class="size-2.5 rounded-full bg-emerald-400"></span>
      </div>
      <span class="ml-2 text-xs text-zinc-400">vue-training:~/quiz</span>
    </div>

    <div class="flex min-h-24 items-start gap-3 px-5 py-4 font-mono text-zinc-100">
      <span class="shrink-0 text-emerald-400 text-3xl animate-pulse" aria-hidden="true"> ❯ </span>

      <div class="block font-semibold md:flex md:items-center md:text-[1.3rem]">
        <QuizTypewriterText class="flex-1 leading-7" :html="parsedQuestion" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss"></style>
