<script setup lang="ts">
import useQuizData from "@/composables/quiz/useQuizData";
import useChallengeData from "@/composables/challenge/useChallengeData";
import HeaderIllustration from "@/components/assets/illustrations/HeaderIllustration.vue";
import QuizCard from "@/components/quiz/QuizCard.vue";
import ChallengeCard from "@/components/challenge/ChallengeCard.vue";
import SwiperComponent from "@/components/ui/SwiperComponent.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import IconHome from "@/components/assets/icons/IconHome.vue";

definePageMeta({ 
  menu: true, 
  index: 1,
  titleKey: "menu-label.home",
  icon: IconHome
});
useStaticPageSeo();

const { locale } = useI18n();

const { quizzes, getQuizzes} = useQuizData();
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
        <h1 class="text-4xl sm:text-5xl md:text-6xl !leading-tight font-bold mx-auto lg:mx-0">
          {{ $t("home.welcome-one") }} 
          {{ $t("home.welcome-two") }}
          {{ $t("home.welcome-three") }} 
          <span class="text-brand-main-600">{{$t("home.welcome-four") }}</span>
          {{ $t("home.welcome-five") }} 
          <span class="text-brand-main-600">Vue.js</span>
        </h1>
        <p class="text-xl sm:text-2xl my-5 sm:my-10 max-w-[500px]">
          {{ $t("home.description") }}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:w-max gap-4 justify-center lg:justify-start">
          <BaseButton type="NuxtLink" variant="primary" to="/quizzes" class="gap-1">
            {{$t("home.hero_button_text")}} <Icon name="mdi:arrow-right" size="24"></Icon>
          </BaseButton>
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
      <BaseButton type="NuxtLink" to="/quizzes" class="w-max mx-auto mt-2">
        {{$t("general.goTo")}} {{ $t("general.quiz.many") }}
      </BaseButton>
    </section>
  
    <!-- Challenges -->
    <section class="mt-20">
      <h2 class="text-2xl md:text-3xl font-bold text-center">{{ $t("general.challenge.many") }}</h2>
      <SwiperComponent :items="challenges">
        <template #slide="{ item }">
          <ChallengeCard :challenge="item"/>
        </template>
      </SwiperComponent>
      <BaseButton type="NuxtLink" to="/challenges" class="w-max mx-auto mt-2">
        {{$t("general.goTo")}} {{$t("general.challenge.many") }}
      </BaseButton>
    </section>
  </div>
</template>

<style>
</style>
