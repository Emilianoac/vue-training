<script lang="ts" setup>
import HeaderComponent from "@/components/layout/HeaderComponent.vue";
import MobileNavbarComponent from "@/components/layout/MobileNavbarComponent.vue";
import FooterComponent from "~/components/layout/FooterComponent.vue";
</script>

<template>
  <HeaderComponent variant="landing" class="px-4 py-2" />
  <div class="container mx-auto px-4 mb-20 min-h-[80vh]">
    <slot />
  </div>
  <FooterComponent />
</template>

<style lang="postcss"></style>
