<script lang="ts" setup>

const menuItems = [
  { title: "general.home", path: "/" },
  { title: "general.challenge.many", path: "/challenges" },
  { title: "general.quiz.many", path: "/quizzes" },
]
</script>

<template>
  <nav class="bg-slate-100 dark:bg-slate-900 text-black dark:text-white rounded-md shadow-md bottom-3 mx-6 sticky block md:hidden">
    <div class="flex items-center justify-between container mx-auto p-4">
      <router-link v-for="(menuItem, index) in menuItems" :key="index" :to="menuItem.path" class="hover:underline">
        {{ $t(menuItem.title) }}
      </router-link>
    </div>
  </nav>
</template>

<style lang="postcss" scoped>
  
</style>
