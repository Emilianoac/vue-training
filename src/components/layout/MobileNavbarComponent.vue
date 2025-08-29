<script lang="ts" setup>
  import { useRouter } from "vue-router";

  const router = useRouter();
  
  const menuItems = router.getRoutes().filter(route => {
    return route.meta.menu === true
  });
</script>

<template>
  <nav class="bg-white dark:bg-slate-900 text-black dark:text-white border border-gray-100 dark:border-slate-800 rounded-md shadow-md bottom-3 mx-2 fixed right-0 left-0 block md:hidden z-[999]">
    <div class="flex items-center justify-between container mx-auto p-2">
      <router-link 
        v-for="(menuItem, index) in menuItems" 
        :key="index" 
        :to="menuItem.path" 
        active-class="text-color-primary font-semibold"
        class="text-[0.7em] border-r last-of-type:border-0 border-slate-200 dark:border-slate-800 block w-full text-center py-1">
          <component 
            :is="menuItem.meta.icon" 
            width="18" 
            height="18" 
            class="mx-auto" 
          />
          {{ $t(menuItem.meta.titleKey ?? '') }}
      </router-link>
    </div>
  </nav>
</template>

<style lang="postcss" scoped>
  
</style>
