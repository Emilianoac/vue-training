<script lang="ts" setup>
import HeaderComponent from "@/components/global/HeaderComponent.vue";
import MobileNavbarComponent from "@/components/global/MobileNavbarComponent.vue";
</script>

<template>
  <HeaderComponent/>
  <div class="container mx-auto px-4 md:px-10 mb-20">
    <slot />
  </div>
  <MobileNavbarComponent/>
</template>

<style lang="postcss">
</style>
