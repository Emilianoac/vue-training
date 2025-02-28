<script setup lang="ts">
import headerIllustration from "@/assets/images/header-illustration.png";
</script>

<template>
    <div class="block md:flex  items-center justify-between mt-14">
      <div class="mb-10 md:mb-0">
        <h1 class="text-4xl md:text-6xl font-bold max-w-[540px]">
          Desafios y trivias para practicar con
          <span class="text-color-primary font-extrabold">Vue.js</span>
        </h1>
        <p class="text-lg mt-5 max-w-[480px]">
          Pon a prueba tu conocimiento y sigue mejorando con cada desafío.
        </p>
        <div class="mt-5">
          <router-link to="/quizzes" class="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full mt-4 inline-block text-sm">
            Cuestionarios
          </router-link>

          <router-link to="/desafios" class="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full mt-4 ml-4 inline-block text-sm">
            Desafíos
          </router-link>
        </div>
      </div>
      <div>
        <img :src="headerIllustration" alt="">
      </div>
    </div>
</template>
