<script lang="ts" setup>
import LearningPath from "@/components/learning-path/LearningPath.vue";
import { ScrollArea } from "@/components/ui/scroll-area";
import { consumeLearningPathSection } from "@/composables/learning-path/useLearningPathNavigation";

useStaticPageSeo("learning_path");

definePageMeta({
  layout: "learn",
  layoutTransition: {
    onEnter(el) {
      const sectionId = consumeLearningPathSection("vue-3-path");
      if (!sectionId) return;

      window.requestAnimationFrame(async () => {
        await Promise.allSettled(
          el.getAnimations().map((animation) => animation.finished),
        );

        document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
      });
    },
  },
});
</script>

<template>
  <ScrollArea class="h-full pr-4" type="auto">
    <LearningPath path-id="vue-3-path" />
  </ScrollArea>
</template>
