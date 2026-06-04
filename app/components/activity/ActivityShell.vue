<script setup lang="ts">
defineProps<{
  title: string;
  backTo: string;
  contentClass?: string;
}>();
</script>

<template>
  <article class="flex h-full min-h-0 flex-col">
    <ActivityHeader :title="title" :back-to="backTo" />

    <div :class="[' min-h-0 flex-1 overflow-hidden', contentClass]">
      <slot />
    </div>
  </article>
</template>
