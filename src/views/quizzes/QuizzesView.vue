<script setup lang="ts">
import quizzes from "@/data/quizzes";
import { useGeneralStore } from "@/stores/general";
import QuizListComponent from "@/components/quiz/QuizListComponent.vue";

const store = useGeneralStore();

</script>

<template>
  <div class="mt-7">
    <h1 class="text-2xl md:text-3xl font-bold text-center">{{ $t("general.quiz.many")}}</h1>
    <QuizListComponent :quizzes="quizzes" />
  </div>
</template>