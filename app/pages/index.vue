<script setup lang="ts">
import useQuizData from "@/composables/quiz/useQuizData";
import useChallengeData from "@/composables/challenge/useChallengeData";
import Vuecito from "@/components/assets/illustrations/Vuecito.vue";
import QuizCard from "@/components/quiz/QuizCard.vue";
import ChallengeCard from "@/components/challenge/ChallengeCard.vue";
import SwiperComponent from "@/components/ui/SwiperComponent.vue";
import IconHome from "@/components/assets/icons/IconHome.vue";
import IconQuiz from "@/components/assets/icons/IconQuiz.vue";
import IconTerminal from "@/components/assets/icons/IconTerminal.vue";
import { Button } from "@/components/ui/button";

definePageMeta({
  menu: true,
  index: 1,
  titleKey: "menu-label.home",
  icon: IconHome,
});
useStaticPageSeo();

const { locale } = useI18n();

const { quizzes, getQuizzes } = useQuizData();
const { challenges, getChallenges } = useChallengeData();

await getQuizzes();
await getChallenges();

watch(
  () => locale.value,
  async () => {
    await getQuizzes();
    await getChallenges();
  },
);
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative flex items-center justify-center min-h-[100vh] overflow-hidden p-10">
      <div class="absolute inset-0 hero-gradient"></div>
      <div class="relative z-10 text-center max-w-4xl mx-auto">
        <h1 class="text-4xl lg:text-7xl font-extrabold mb-6">
          {{ $t("home.welcome-one") }}
          {{ $t("home.welcome-two") }}
          {{ $t("home.welcome-three") }}
          <span class="text-primary"> {{ $t("home.welcome-four") }} </span>
          {{ $t("home.welcome-five") }}
          <span class="text-primary">Vue.js</span>
        </h1>
        <p class="text-xl max-w-2xl mx-auto">{{ $t("home.description") }}</p>

        <Button
          size="xl"
          class="md:text-xl h-auto py-3 px-5 mt-10 shadow-[0_0_30px_rgba(105,220,164,0.3)]"
          as-child
        >
          <NuxtLink to="/dashboard">
            {{ $t("home.hero_button_text") }}
            <Icon name="mdi:arrow-right" size="24"></Icon>
          </NuxtLink>
        </Button>
      </div>
    </section>

    <!-- Features Section -->
    <section>
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <!-- Quizzes -->
        <article class="md:col-span-6 xl:col-span-8 bg-card rounded-md p-8">
          <div class="space-y-7">
            <div class="bg-primary w-max p-3 rounded-md">
              <IconQuiz fill-color="fill-primary-foreground" />
            </div>
            <div class="space-y-3">
              <h3 class="text-2xl font-bold">{{ $t("home.features.quizzes.title") }}</h3>
              <p class="max-w-md">
                {{ $t("home.features.quizzes.description") }}
              </p>
            </div>
            <Button size="xl" variant="secondary" as-child>
              <NuxtLink to="/quizzes">
                {{ $t("home.features.quizzes.button_text") }}
                <Icon name="mdi:arrow-right" size="24"></Icon>
              </NuxtLink>
            </Button>
          </div>
        </article>

        <!-- Challenges -->
        <article class="md:col-span-6 xl:col-span-4 bg-card rounded-md p-8">
          <div class="space-y-7">
            <div class="bg-primary w-max p-3 rounded-md">
              <IconTerminal fill-color="fill-primary-foreground" />
            </div>
            <div class="space-y-3">
              <h3 class="text-2xl font-bold">{{ $t("home.features.challenges.title") }}</h3>
              <p>{{ $t("home.features.challenges.description") }}</p>
            </div>
            <Button size="xl" variant="secondary" as-child>
              <NuxtLink to="/quizzes">
                {{ $t("home.features.challenges.button_text") }}
                <Icon name="mdi:arrow-right" size="24"></Icon>
              </NuxtLink>
            </Button>
          </div>
        </article>

        <!-- Vue tips -->
        <article class="lg:col-span-12 bg-card rounded-md p-8">
          <div class="grid grid-co1 md:grid-cols-2 items-center gap-8">
            <div class="space-y-4">
              <h3 class="text-2xl md:text-3xl font-bold">{{ $t("home.features.tips.title") }}</h3>
              <p class="md:text-xl max-w-[600px]">{{ $t("home.features.tips.description") }}</p>
            </div>
            <Vuecito class="mx-auto max-w-[200px] h-auto" tip-id="tip-home" />
          </div>
        </article>
      </div>
    </section>

    <!-- Quizzes -->
    <section class="mt-20">
      <div class="flex items-center justify-between">
        <h2 class="text-xl md:text-2xl font-bold">{{ $t("general.quiz.many") }}</h2>
        <Button variant="link" class="text-foreground">
          {{ $t("general.goTo") }} {{ $t("general.quiz.many") }}
          <Icon name="mdi:arrow-right" size="24"></Icon>
        </Button>
      </div>
      <SwiperComponent :items="quizzes">
        <template #slide="{ item }">
          <QuizCard :quiz="item" />
        </template>
      </SwiperComponent>
    </section>

    <!-- Challenges -->
    <section class="mt-20">
      <div class="flex items-center justify-between">
        <h2 class="text-xl md:text-2xl font-bold">{{ $t("general.challenge.many") }}</h2>
        <Button variant="link" class="text-foreground">
          {{ $t("general.goTo") }} {{ $t("general.challenge.many") }}
          <Icon name="mdi:arrow-right" size="24"></Icon>
        </Button>
      </div>
      <SwiperComponent :items="challenges">
        <template #slide="{ item }">
          <ChallengeCard :challenge="item" />
        </template>
      </SwiperComponent>
    </section>

    <!-- Call to Action -->
    <section class="py-24 text-center">
      <article class="bg-card max-w-4xl mx-auto p-10 md:p-20 rounded-md relative overflow-hidden">
        <div
          class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-50"
        ></div>
        <div class="space-y-4">
          <h2 class="text-2xl md:text-5xl font-extrabold">
            {{ $t("home.call_to_action.title") }}<span class="text-primary"> Vue?</span>
          </h2>
          <p class="text-base md:text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto">
            {{ $t("home.call_to_action.description") }}
          </p>
        </div>
        <Button
          size="xl"
          class="md:text-xl h-auto py-3 px-5 mt-5 shadow-[0_0_30px_rgba(105,220,164,0.3)]"
          as-child
        >
          <NuxtLink to="/quizzes">
            {{ $t("home.call_to_action.button_text") }}
            <Icon name="mdi:arrow-right" size="24"></Icon>
          </NuxtLink>
        </Button>
      </article>
    </section>
  </div>
</template>

<style>
.hero-gradient {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(66, 184, 131, 0.1) 0%,
    rgba(19, 19, 19, 0) 70%
  );
}
</style>
