<script setup lang="ts">
import challenges from "@/data/challenges";
import headerIllustration from "@/assets/images/header-illustration.png";
import ChallengeCardComponent from "@/components/ChallengeCardComponent.vue";

</script>

<template>
    <!-- Header -->
    <section class="block md:flex  items-center justify-between mt-14">
      <div class="mb-10 md:mb-0">
        <h1 class="text-4xl md:text-6xl font-bold max-w-[540px]">
          {{ $t("home.welcome") }} 
          <span class="text-color-primary font-extrabold">Vue.js</span>
        </h1>
        <p class="text-lg mt-5 max-w-[480px]">
          {{ $t("home.description") }}
        </p>
        <div class="mt-5">
          <router-link to="/quizzes" class="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full mt-4 inline-block text-sm">
           {{ $t("general.quiz.many") }}
          </router-link>

          <router-link to="/challenges" class="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full mt-4 ml-4 inline-block text-sm">
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        <ChallengeCardComponent 
          v-for="challenge in challenges" 
          :key="challenge.id" 
          :name="challenge.title" 
          :level="challenge.level" 
          :level-label="challenge.levelLabel"
          :img="challenge.cover"
          :description="challenge.short_description"
          :id="challenge.id" 
        />
      </div>
    </section>

</template>
