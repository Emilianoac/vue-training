<script lang="ts" setup>
import LangToggleComponent from "@/components/layout/LangToggleComponent.vue";
import SiteBrandComponent from "@/components/layout/SiteBrandComponent.vue";
import ThemeToggleComponent from "@/components/layout/ThemeToggleComponent.vue";

const props = defineProps<{
  variant: "landing" | "learn";
  showLangToggle?: boolean;
}>();
</script>

<template>
  <header class="bg-background border-b border-border flex items-center justify-between px-4">
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
