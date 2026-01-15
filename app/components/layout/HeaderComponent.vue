<script lang="ts" setup>
  import { useRouter } from "vue-router"
  import LangToggleComponent from "@/components/layout/LangToggleComponent.vue";
  import SiteBrandComponent from "@/components/layout/SiteBrandComponent.vue";
  import ThemeToggleComponent from "@/components/layout/ThemeToggleComponent.vue";

  const router = useRouter();

  const menuItems = router.getRoutes().filter(route => {
    return route.meta.menu === true
  });
</script>

<template>
  <header class=" bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800  sticky top-0 z-50">
    <div class="container mx-auto flex items-center justify-between p-4">
      <NuxtLink to="/">
        <SiteBrandComponent class="max-w-[160px]" />
      </NuxtLink>
      <div class="flex items-center gap-5">
        <nav>
          <ul class="hidden sm:flex space-x-6">
            <li v-for="(menuItem, index) in menuItems" :key="index">
              <NuxtLink
                :to="menuItem.path" 
                class="border-b-[3px] border-transparent pb-1 hover:border-b-[3px] hover:border-b-brand-main-500/30"
                active-class="border-b-brand-main-500 hover:!border-b-brand-main-500">
                  {{ $t(menuItem.meta.titleKey ?? '') }}
              </NuxtLink>
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
