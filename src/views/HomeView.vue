<script setup lang="ts">
import challenges from "@/data/challenges";
import quizzes from "@/data/quizzes";
import HeaderIllustration from "@/components/HeaderIllustration.vue";
import CardComponent from "@/components/CardComponent.vue";
import SwiperComponent from "@/components/SwiperComponent.vue";
</script>

<template>
  <!-- Hero Section -->
  <section class="block lg:flex items-center justify-between my-14 lg:my-14">
    <div class="mb-10 md:mb-0 text-center lg:text-left">
      <h1 class="text-4xl md:text-6xl font-bold max-w-[560px] mx-auto lg:mx-0">
        {{ $t("home.welcome") }} 
        Vue.js
      </h1>
      <p class="text-lg mt-5 max-w-[480px] mx-auto lg:mx-0">
        {{ $t("home.description") }}
      </p>
      <div class="mt-5 gap-4 flex justify-center lg:justify-start">
        <router-link to="/quizzes" class="app-button primary">
          {{$t("general.goTo")}} {{ $t("general.quiz.many") }}
        </router-link>

        <router-link to="/challenges" class="app-button primary">
          {{$t("general.goTo")}} {{$t("general.challenge.many") }}
        </router-link>
      </div>
    </div>
    <div>
      <HeaderIllustration />
    </div>
  </section>

  <!-- Quizzes -->
  <section class="mt-20">
    <h2 class="text-2xl md:text-3xl font-bold text-center">{{ $t("general.quiz.many") }}</h2>
    <SwiperComponent>
      <swiper-slide v-for="quiz in quizzes" :key="quiz.id">
        <CardComponent
          :title="quiz.title"
          :description="quiz.description"
          :level="quiz.level"
          :type="'quiz'"
          :img="quiz.category.image"
          :levelLabel="quiz.levelLabel"
          :link="`/quizzes/${quiz.id}`">
        </CardComponent>
      </swiper-slide>
    </SwiperComponent>
  </section>

  <!-- Challenges -->
  <section class="mt-20">
    <h2 class="text-2xl md:text-3xl font-bold text-center">{{ $t("general.challenge.many") }}</h2>
    <SwiperComponent>
      <swiper-slide v-for="challenge in challenges" :key="challenge.id">
        <CardComponent
          :title="challenge.title"
          :description="challenge.description"
          :level="challenge.level"
          :type="'challenge'"
          :img="challenge.cover"
          :levelLabel="challenge.levelLabel"
          :link="`/challenges/${challenge.id}`">
        </CardComponent>
      </swiper-slide>
    </SwiperComponent>
  </section>
</template>

<style>
</style>
