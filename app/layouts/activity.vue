<script lang="ts" setup>
import HeaderComponent from "@/components/layout/HeaderComponent.vue";
</script>

<template>
  <div class="flex h-auto lg:h-dvh flex-col bg-background">
    <HeaderComponent variant="learn" :show-lang-toggle="false" class="shrink-0" />
    <main class="min-h-0 flex-1 overflow-hidden">
      <slot />
    </main>
  </div>
</template>
