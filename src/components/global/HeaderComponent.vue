<script lang="ts" setup>
  import LangToggleComponent from "@/components/global/LangToggleComponent.vue";
  import SiteBrandComponent from "@/components/global/SiteBrandComponent.vue";
  import ThemeToggleComponent from "@/components/global/ThemeToggleComponent.vue";

  const menuItems = [
    { title: "general.quiz.many", path: "/quizzes" },
    { title:  "general.challenge.many", path: "/challenges" },
  ]
</script>

<template>
  <header class="bg-slate-50 dark:bg-slate-900 text-black dark:text-white">
    <div class="flex items-center justify-between container mx-auto p-4 px-4 md:px-10">
      <router-link to="/">
        <SiteBrandComponent class="max-w-[160px]" />
      </router-link>
      <div class="flex items-center gap-5">
        <nav>
          <ul class="hidden sm:flex space-x-4">
            <li v-for="(menuItem, index) in menuItems" :key="index">
              <router-link :to="menuItem.path" class="border-b-[3px] border-transparent pb-1" active-class="border-b-color-primary">
                {{ $t(menuItem.title) }}
              </router-link>
            </li>
          </ul>
        </nav>
        <div class="flex items-center gap-2">
          <ThemeToggleComponent />
          <LangToggleComponent />
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="postcss">
</style>
