<script lang="ts" setup>
  import IconMoon from "@/components/assets/icons/IconMoon.vue";
  import IconSun from "@/components/assets/icons/IconSun.vue";

  const colorMode = useColorMode();

  function toggleColorMode() {
    let newColorMode = colorMode.value == "dark" ? "Light" : "dark";
    colorMode.preference = newColorMode
  }
</script>

<template>
    <button 
      @click="toggleColorMode()" 
      class="p-2 rounded-md bg-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none">
      <IconSun v-if="$colorMode.value === 'dark'" class="w-4 h-4 text-yellow-500" />
      <IconMoon v-else class="w-4 h-4 text-yellow-500" />
    </button>
</template>

<style lang="postcss" scoped>
  
</style>
