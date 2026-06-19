<script lang="ts" setup>
import LearningPath from "@/components/learning-path/LearningPath.vue";
import { ScrollArea } from "@/components/ui/scroll-area";

definePageMeta({
  layout: "learn",
});

useStaticPageSeo("learning_path");
</script>

<template>
  <ScrollArea class="h-full md:pr-4">
    <LearningPath path-id="vue-3-path" />
  </ScrollArea>
</template>
