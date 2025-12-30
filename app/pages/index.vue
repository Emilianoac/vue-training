<script setup lang="ts">
import useQuizData from "@/composables/quiz/useQuizData";
import useChallengeData from "@/composables/challenge/useChallengeData";
import HeaderIllustration from "@/components/assets/illustrations/HeaderIllustration.vue";
import QuizCard from "@/components/quiz/QuizCard.vue";
import ChallengeCard from "@/components/challenge/ChallengeCard.vue";
import SwiperComponent from "@/components/ui/SwiperComponent.vue";

definePageMeta({ menu: true, titleKey: "menu-label.home" });
useStaticPageSeo();

const { locale } = useI18n();


const {quizzes, getQuizzes} = useQuizData();
const { challenges, getChallenges } = useChallengeData();

await getQuizzes();
await getChallenges();

watch(() => locale.value, async() => {
  await getQuizzes();
  await getChallenges();
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="block lg:grid grid-cols-[1fr_0.8fr] items-center justify-between my-14 gap-8">
      <div class="mb-10 md:mb-0">
        <h1 class="text-5xl md:text-6xl !leading-tight font-bold mx-auto lg:mx-0">
          {{ $t("home.welcome-one") }} 
          <span class="text-color-primary">{{ $t("home.welcome-two") }}</span>
          {{ $t("home.welcome-three") }}
          Vue.js
        </h1>
        <p class="text-2xl my-10  max-w-[500px]">
          {{ $t("home.description") }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:w-max gap-4 justify-center lg:justify-start">
          <NuxtLink to="/quizzes" class="app-button primary px-8">
            {{$t("general.goTo")}} {{ $t("general.quiz.many") }}
          </NuxtLink>
  
          <NuxtLink to="/challenges" class="app-button-outline px-8">
            {{$t("general.goTo")}} {{$t("general.challenge.many") }}
          </NuxtLink>
        </div>
      </div>
      <HeaderIllustration class="max-w-[500px] lg:max-w-none mx-auto" />
    </section>
  
    <!-- Quizzes -->
    <section class="mt-20">
      <h2 class="text-2xl md:text-3xl font-bold text-center">{{ $t("general.quiz.many") }}</h2>
      <SwiperComponent :items="quizzes">
        <template #slide="{ item }">
          <QuizCard :quiz="item"/>
        </template>
      </SwiperComponent>
      <NuxtLink to="/quizzes" class="app-button primary !block w-max mx-auto mt-8">
        {{$t("general.goTo")}} {{ $t("general.quiz.many") }}
      </NuxtLink>
    </section>
  
    <!-- Challenges -->
    <section class="mt-20">
      <h2 class="text-2xl md:text-3xl font-bold text-center">{{ $t("general.challenge.many") }}</h2>
      <SwiperComponent :items="challenges">
        <template #slide="{ item }">
          <ChallengeCard :challenge="item"/>
        </template>
      </SwiperComponent>
      <NuxtLink to="/challenges" class="app-button primary !block w-max mx-auto mt-8">
        {{$t("general.goTo")}} {{$t("general.challenge.many") }}
      </NuxtLink>
    </section>
  </div>
</template>

<style>
</style>
