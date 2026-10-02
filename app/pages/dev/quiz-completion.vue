<script setup lang="ts">
import { Button } from "@/components/ui/button";
import QuizCompletionDialog from "@/components/quiz/player/stages/results/QuizCompletionDialog.vue";
import { QUIZ_PASS_PERCENTAGE, type QuizOutcome } from "@/domain/quiz/getQuizOutcome";

if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: "Page not found" });
}

definePageMeta({
  layout: "blank",
});

const percentages: Record<QuizOutcome, number> = {
  failed: 40,
  passed: 80,
  perfect: 100,
};
const outcomes: QuizOutcome[] = ["failed", "passed", "perfect"];
const modes = ["standalone", "learning-path"] as const;

const dialogOpen = ref(true);
const outcome = ref<QuizOutcome>("passed");
const mode = ref<"standalone" | "learning-path">("learning-path");
const percentage = computed(() => percentages[outcome.value]);

function selectOutcome(value: QuizOutcome) {
  outcome.value = value;
  dialogOpen.value = true;
}

function selectMode(value: "standalone" | "learning-path") {
  mode.value = value;
  dialogOpen.value = true;
}
</script>

<template>
  <main class="mx-auto flex min-h-dvh w-full max-w-2xl flex-col justify-center p-6">
    <div class="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <h1 class="mt-2 text-2xl font-bold">Quiz completion dialog</h1>

      <section class="mt-6">
        <h2 class="text-sm font-semibold">Resultado</h2>
        <div class="mt-3 flex flex-wrap gap-2">
          <Button
            v-for="value in outcomes"
            :key="value"
            :variant="outcome === value ? 'default' : 'outline'"
            @click="selectOutcome(value)"
          >
            {{ value }}
          </Button>
        </div>
      </section>

      <section class="mt-6">
        <h2 class="text-sm font-semibold">Contexto</h2>
        <div class="mt-3 flex flex-wrap gap-2">
          <Button
            v-for="value in modes"
            :key="value"
            :variant="mode === value ? 'default' : 'outline'"
            @click="selectMode(value)"
          >
            {{ value }}
          </Button>
        </div>
      </section>

      <Button class="mt-8" @click="dialogOpen = true">Abrir modal</Button>
    </div>
  </main>

  <QuizCompletionDialog
    v-model:open="dialogOpen"
    :outcome="outcome"
    :percentage="percentage"
    :required-percentage="QUIZ_PASS_PERCENTAGE"
    :mode="mode"
  />
</template>
