<script lang="ts" setup>
import type { Tip } from "@/schemas/tip.schema";
import useMarkdownParser from "@/composables/useMarkdownParser";

const { parse } = useMarkdownParser();

const props = defineProps<{
  tip: Tip;
}>();

const parsedExplanation = computed(() => {
  if (!props.tip) return "";
  return parse(props.tip.content);
});
</script>

<template>
  <div class="tip-container bg-card border w-full overflow-auto p-4 md:p-7">
    <div>
      <!-- Tip explanation -->
      <div v-html="parsedExplanation"></div>

      <!-- Source link -->
      <div v-if="tip.source_url" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <span class="block mb-1 text-sm">{{ $t("randomTip.general.source") }} </span>
        <a
          :href="tip.source_url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {{ tip.source_url }}
        </a>
      </div>

      <hr class="my-6 border-t border-gray-200 dark:border-gray-800" />

      <!-- Tip code examples -->
      <ClientOnly>
        <template v-if="tip.code_examples.length">
          <highlightjs
            v-for="(codeExample, index) in tip.code_examples"
            :key="index"
            class="text-sm rounded-md overflow-hidden mt-4"
            :language="codeExample.lang"
            :code="codeExample.code"
          />
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tip-container {
  :deep(h2) {
    font-size: 1.2em;
    margin-bottom: 0.5em;
  }

  :deep(p) {
    margin-bottom: 1em;
    line-height: 1.8rem;

    code {
      white-space: nowrap;
    }
  }
}
</style>
