<script lang="ts" setup>
import type { Tip } from "@/schemas/tip.schema";

const props = defineProps<{
  tip: Tip;
}>();
</script>

<template>
  <div class="tip-container">
    <ContentRenderer :value="tip" />
  </div>
</template>

<style lang="scss" scoped>
.tip-container {
  :deep(p) {
    font-size: 0.95rem;
    margin-bottom: 0.5em;
    line-height: 1.8rem;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  :deep(hr) {
    margin: 1em 0;
    opacity: 0;
  }
}
</style>
