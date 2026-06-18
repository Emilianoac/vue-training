<script lang="ts" setup>
import {
  LightbulbIcon,
  RouteIcon,
  FileQuestion,
  SquareTerminalIcon,
  DicesIcon,
} from "lucide-vue-next";
import useQuizData from "@/composables/quiz/useQuizData";
import useChallengeData from "@/composables/challenge/useChallengeData";

import SwiperComponent from "@/components/ui/SwiperComponent.vue";
import TipCarousel from "@/components/tip/TipCarousel.vue";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const { t, locale } = useI18n();

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

const { quizzes, getQuizzes } = useQuizData();
const { challenges, getChallenges } = useChallengeData();

await getQuizzes(3);
await getChallenges(3);

watch(
  () => locale.value,
  async () => {
    await getQuizzes(3);
    await getChallenges(3);
  },
);
</script>

<template>
  <ScrollArea class="h-full md:pr-4">
    <div class="space-y-6">
      <h1 class="text-xl md:text-2xl font-bold">{{ t("learn.home.title") }}</h1>
      <section class="space-y-2">
        <h2 class="font-semibold">Tips</h2>
        <div class="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
          <TipCarousel />
          <Card class="h-full flex flex-col items-center justify-center p-3 gap-2">
            <Button variant="secondary" size="xl" as-child>
              <NuxtLink to="/learn/tips">
                {{ $t("learn.home.sections.tips.seeMore") }}<LightbulbIcon />
              </NuxtLink>
            </Button>
            <p class="text-xs text-center max-w-57.5">
              {{ $t("learn.home.sections.tips.description") }}
            </p>
          </Card>
        </div>
      </section>

      <section class="space-y-2">
        <h2 class="font-semibold">{{ $t("sections") }}</h2>
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        </div>
      </section>

      <section class="space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold">{{ $t("general.quiz.many") }}</h2>
          <Button variant="link" class="text-foreground">
            {{ $t("general.goTo") }} {{ $t("general.quiz.many") }}
            <Icon name="mdi:arrow-right" size="24"></Icon>
          </Button>
        </div>
        <SwiperComponent class="p-0!" :items="quizzes">
          <template #slide="{ item }">
            <QuizCard :quiz="item" />
          </template>
        </SwiperComponent>
      </section>

      <section class="space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold">{{ $t("general.challenge.many") }}</h2>
          <Button variant="link" class="text-foreground">
            {{ $t("general.goTo") }} {{ $t("general.challenge.many") }}
            <Icon name="mdi:arrow-right" size="24"></Icon>
          </Button>
        </div>
        <SwiperComponent class="p-0!" :items="challenges">
          <template #slide="{ item }">
            <ChallengeCard :challenge="item" />
          </template>
        </SwiperComponent>
      </section>
    </div>
  </ScrollArea>
</template>

<style lang="postcss" scoped></style>
