<script setup lang="ts">
import headerIllustration from "@/assets/images/header-illustration.png";
import ChallengeListComponent from "@/components/challenge/ChallengeListComponent.vue";
import QuizListComponent from "@/components/quiz/QuizListComponent.vue";

</script>

<template>
    <!-- Header -->
    <section class="block md:flex  items-center justify-between my-14 md:my-14">
      <div class="mb-10 md:mb-0">
        <h1 class="text-4xl md:text-6xl font-bold max-w-[540px]">
          {{ $t("home.welcome") }} 
          <span>Vue.js</span>
        </h1>
        <p class="text-lg mt-5 max-w-[480px]">
          {{ $t("home.description") }}
        </p>
        <div class="mt-5 gap-4 flex">
          <router-link to="/quizzes" class="app-button primary">
           {{ $t("general.quiz.many") }}
          </router-link>

          <router-link to="/challenges" class="app-button primary">
            {{ $t("general.challenge.many") }}
          </router-link>
        </div>
      </div>
      <div>
        <img :src="headerIllustration" alt="Header Illustration"/>
      </div>
    </section>

    <!-- Challenges -->
    <section class="mt-20">
      <h2 class="text-3xl font-bold text-center">{{ $t("general.challenge.many") }}</h2>
      <ChallengeListComponent />
    </section>

    <!-- Quizzes -->
    <section class="mt-20">
      <h2 class="text-3xl font-bold text-center">{{ $t("general.quiz.many") }}</h2>
      <QuizListComponent />
    </section>

</template>
