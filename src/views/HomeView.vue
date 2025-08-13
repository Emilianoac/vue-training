<script setup lang="ts">
import challenges from "@/data/challenges";
import quizzes from "@/data/quizzes";
import HeaderIllustration from "@/components/illustrations/HeaderIllustration.vue";
import CardComponent from "@/components/CardComponent.vue";
import SwiperComponent from "@/components/SwiperComponent.vue";
</script>

<template>
  <!-- Hero Section -->
  <section class="block lg:grid grid-cols-[1fr_0.6fr] items-center justify-between my-14 lg:my-14">
    <div class="mb-10 md:mb-0">
      <h1 class="text-5xl md:text-6xl !leading-tight font-bold mx-auto lg:mx-0">
        {{ $t("home.welcome") }} 
        Vue.js
      </h1>
      <p class="text-2xl my-10  max-w-[500px]">
        {{ $t("home.description") }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:w-max gap-4 justify-center lg:justify-start">
        <router-link to="/quizzes" class="app-button primary px-8">
          {{$t("general.goTo")}} {{ $t("general.quiz.many") }}
        </router-link>

        <router-link to="/challenges" class="app-button-outline px-8">
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
      <swiper-slide v-for="quiz in quizzes" :key="quiz.id" class="py-4">
        <CardComponent
          :title="quiz.title"
          :description="quiz.description"
          :level="quiz.level"
          :type="'quiz'"
          :category="quiz.category.name"
          :img="quiz.category.image"
          :levelLabel="quiz.levelLabel"
          :link="`/quizzes/${quiz.id}`">
        </CardComponent>
      </swiper-slide>
    </SwiperComponent>
    <router-link to="/quizzes" class="app-button primary !block w-max mx-auto mt-8">
      {{$t("general.goTo")}} {{ $t("general.quiz.many") }}
    </router-link>
  </section>

  <!-- Challenges -->
  <section class="mt-20">
    <h2 class="text-2xl md:text-3xl font-bold text-center">{{ $t("general.challenge.many") }}</h2>
    <SwiperComponent>
      <swiper-slide v-for="challenge in challenges" :key="challenge.id" class="py-4">
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
    <router-link to="/challenges" class="app-button primary !block w-max mx-auto mt-8">
      {{$t("general.goTo")}} {{$t("general.challenge.many") }}
    </router-link>
  </section>
</template>

<style>
</style>
