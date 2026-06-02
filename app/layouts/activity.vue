<script lang="ts" setup>
import HeaderComponent from "@/components/layout/HeaderComponent.vue";
</script>

<template>
  <div class="flex flex-col h-auto lg:h-screen bg-background [--header-height:50px]">
    <HeaderComponent
      variant="learn"
      :show-lang-toggle="false"
      class="h-(--header-height) shrink-0 border-b"
    />
    <main class="min-h-0 flex-1 overflow-hidden p-6">
      <slot />
    </main>
  </div>
</template>
