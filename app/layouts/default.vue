<script lang="ts" setup>
import HeaderComponent from "@/components/layout/HeaderComponent.vue";
import MobileNavbarComponent from "@/components/layout/MobileNavbarComponent.vue";
import FooterComponent from "~/components/layout/FooterComponent.vue";
</script>

<template>
  <HeaderComponent/>
  <div class="container max-w-[1280px] mx-auto px-4 md:px-10 mb-20 min-h-[80vh]">
    <slot />
  </div>
  <FooterComponent/>
  <MobileNavbarComponent/>
</template>

<style lang="postcss">
</style>
