<script lang="ts" setup>

const menuItems = [
  { title: "general.home", path: "/" },
  { title: "general.challenge.many", path: "/challenges" },
  { title: "general.quiz.many", path: "/quizzes" },
]
</script>

<template>
  <nav class="bg-white dark:bg-slate-900 text-black dark:text-white rounded-md shadow-md bottom-3 mx-6 fixed right-0 left-0 block md:hidden">
    <div class="grid grid-cols-3 items-center justify-between container mx-auto p-3">
      <router-link 
        v-for="(menuItem, index) in menuItems" 
        :key="index" 
        :to="menuItem.path" 
        active-class="text-color-primary font-semibold"
        class="border-r border-l first-of-type:border-0 last-of-type:border-0 border-slate-400 dark:border-slate-600 block w-full text-[0.95em] text-center py-1">
          {{ $t(menuItem.title) }}
      </router-link>
    </div>
  </nav>
</template>

<style lang="postcss" scoped>
  
</style>
