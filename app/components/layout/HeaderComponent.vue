<script lang="ts" setup>
import LangToggleComponent from "@/components/layout/LangToggleComponent.vue";
import SiteBrandComponent from "@/components/layout/SiteBrandComponent.vue";
import ThemeToggleComponent from "@/components/layout/ThemeToggleComponent.vue";

const props = withDefaults(
  defineProps<{
    variant: "landing" | "learn";
    showLangToggle?: boolean;
  }>(),
  {
    showLangToggle: true,
  },
);
</script>

<template>
  <header class="flex items-center justify-between border-b border-border bg-background px-4 py-2">
    <template v-if="variant == 'learn'">
      <div>
        <slot name="sidebarTrigger" />
        <SiteBrandComponent class="max-w-[150px]" />
      </div>

      <div class="flex items-center gap-5">
        <div class="flex items-center gap-2">
          <ThemeToggleComponent />
          <LangToggleComponent v-if="props.showLangToggle !== false" />
        </div>
      </div>
    </template>

    <div v-if="variant === 'landing'" class="container flex items-center justify-between mx-auto">
      <SiteBrandComponent class="max-w-[150px]" />

      <div class="flex items-center gap-5">
        <div class="flex items-center gap-2">
          <ThemeToggleComponent />
          <LangToggleComponent v-if="props.showLangToggle !== false" />
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="postcss"></style>
