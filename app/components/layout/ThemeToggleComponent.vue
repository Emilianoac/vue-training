<script lang="ts" setup>
  import IconMoon from "@/components/assets/icons/IconMoon.vue";
  import IconSun from "@/components/assets/icons/IconSun.vue";
  import { Button } from "@/components/ui/button";

  const colorMode = useColorMode();

  function toggleColorMode() {
    let newColorMode = colorMode.value == "dark" ? "Light" : "dark";
    colorMode.preference = newColorMode
  }
</script>

<template>
    <Button
      @click="toggleColorMode()" 
      variant="outline"
      size="icon-sm">
      <IconSun v-if="$colorMode.value === 'dark'" class="w-4 h-4 text-yellow-500" />
      <IconMoon v-else class="w-4 h-4 text-yellow-500" />
    </Button>
</template>

<style lang="postcss" scoped>
  
</style>
