<script lang="ts" setup>
  import { useRouter } from "vue-router"
  import LangToggleComponent from "@/components/global/LangToggleComponent.vue";
  import SiteBrandComponent from "@/components/global/SiteBrandComponent.vue";
  import ThemeToggleComponent from "@/components/global/ThemeToggleComponent.vue";

  const router = useRouter();
  
  const menuItems = router.getRoutes().filter(route => {
    return route.meta.menu === true
  });
</script>

<template>
  <header class="bg-white dark:bg-slate-900 text-black dark:text-white sticky top-0 z-50 shadow-sm">
    <div class="flex items-center justify-between container mx-auto p-4 px-4 md:px-10">
      <router-link to="/">
        <SiteBrandComponent class="max-w-[160px]" />
      </router-link>
      <div class="flex items-center gap-5">
        <nav>
          <ul class="hidden sm:flex space-x-4">
            <li v-for="(menuItem, index) in menuItems" :key="index">
              <router-link 
                :to="menuItem.path" 
                class="border-b-[3px] border-transparent pb-1 hover:border-b-[3px] hover:border-b-color-primary/30"
                active-class="border-b-color-primary hover:!border-b-color-primary">
                  {{ $t(menuItem.meta.titleKey ?? '') }}
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
