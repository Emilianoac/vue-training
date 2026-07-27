<script lang="ts" setup>
import HeaderComponent from "@/components/layout/HeaderComponent.vue";
import FooterComponent from "~/components/layout/FooterComponent.vue";
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden">
    <HeaderComponent variant="landing" class="shrink-0" />
    <ScrollArea class="min-h-0 flex-1" type="auto">
      <div class="container mx-auto px-4 mb-20 min-h-[80vh]">
        <slot />
      </div>
      <FooterComponent />
    </ScrollArea>
  </div>
</template>

<style lang="postcss"></style>
