<script lang="ts" setup>
  import { useDark, useToggle } from "@vueuse/core";
  import IconMoon from "@/components/assets/icons/IconMoon.vue";
  import IconSun from "@/components/assets/icons/IconSun.vue";

  const isDark = useDark();
  const toggle = useToggle(isDark);
</script>

<template>
    <button 
      @click="toggle()" 
      class="p-2 rounded-md bg-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none">
      <IconSun v-if="isDark" class="w-4 h-4 text-yellow-500" />
      <IconMoon v-else class="w-4 h-4 text-yellow-500" />
    </button>
</template>

<style lang="postcss" scoped>
  
</style>
