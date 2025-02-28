<script lang="ts" setup>
  import  SiteBrandComponent from "@/components/SiteBrandComponent.vue";

  const menuItems = [
    { title: "Cuestionarios", path: "/quizzes" },
    { title: "Desafios", path: "/challenges" },
  ]
</script>

<template>
  <header class="bg-slate-100 dark:bg-slate-900 text-black dark:text-white">
    <div class="flex items-center justify-between container mx-auto p-4">
      <router-link class="mx-auto sm:mx-0" to="/">
        <SiteBrandComponent class="max-w-[160px]" />
      </router-link>
      <div class="hidden sm:flex items-center gap-5">
        <nav>
          <ul class="flex space-x-4">
            <li v-for="(menuItem, index) in menuItems" :key="index">
              <router-link to="/" class="hover:underline">
                {{ menuItem.title }}
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<style lang="postcss">
</style>
