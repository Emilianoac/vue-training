<script lang="ts" setup>
import { LightbulbIcon, RouteIcon, FileQuestion, SquareTerminalIcon } from "lucide-vue-next";
import TipCarousel from "@/components/tip/TipCarousel.vue";
import { Button } from "@/components/ui/button";

const { t } = useI18n();

const sections = computed(() => [
  {
    title: t("learn.home.sections.learningPaths.title"),
    description: t("learn.home.sections.learningPaths.description"),
    icon: RouteIcon,
    to: "/learn/learning-paths",
  },
  {
    title: t("learn.home.sections.quizzes.title"),
    description: t("learn.home.sections.quizzes.description"),
    icon: FileQuestion,
    to: "/learn/quizzes",
  },
  {
    title: t("learn.home.sections.challenges.title"),
    description: t("learn.home.sections.challenges.description"),
    icon: SquareTerminalIcon,
    to: "/learn/challenges",
  },
  {
    title: t("learn.home.sections.tips.title"),
    description: t("learn.home.sections.tips.description"),
    icon: LightbulbIcon,
    to: "/learn/tips",
  },
]);
</script>

<template>
  <div class="space-y-8">
    <TipCarousel />
    <section class="space-y-3">
      <h1 class="text-3xl font-bold">{{ t("learn.home.title") }}</h1>
      <p class="max-w-2xl text-muted-foreground">
        {{ t("learn.home.description") }}
      </p>
    </section>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <NuxtLink
        v-for="section in sections"
        :key="section.to"
        :to="section.to"
        class="rounded-md border bg-card p-5 transition-colors hover:bg-accent"
      >
        <component :is="section.icon" class="mb-4 size-5 text-primary" />
        <h2 class="font-semibold">{{ section.title }}</h2>
        <p class="mt-2 text-sm text-muted-foreground">{{ section.description }}</p>
      </NuxtLink>
    </section>

    <section class="rounded-md border bg-card p-5">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-xl font-semibold">{{ t("learn.home.continue.title") }}</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ t("learn.home.continue.description") }}
          </p>
        </div>
        <Button as-child>
          <NuxtLink to="/learn/learning-paths">
            {{ t("learn.home.continue.action") }}
          </NuxtLink>
        </Button>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped></style>
