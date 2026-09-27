<script setup lang="ts">
import ProsePre from "@/components/content/ProsePre.vue";

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
  }>(),
  {
    language: "text",
  },
);

const proseComponents = {
  pre: ProsePre,
};

const markdown = computed(() => {
  const code = props.code.replace(/\r\n?/g, "\n");
  const longestBacktickSequence = Math.max(
    0,
    ...Array.from(code.matchAll(/`+/g), (match) => match[0].length),
  );
  const fence = "`".repeat(Math.max(3, longestBacktickSequence + 1));
  const language = /^[\w#+.-]+$/.test(props.language) ? props.language : "text";

  return `${fence}${language}\n${code}\n${fence}`;
});
</script>

<template>
  <div>
    <MDC :value="markdown" :tag="false" partial>
      <template #default="{ body, data }">
        <MDCRenderer
          :body="body"
          :data="data"
          :components="proseComponents"
          :tag="false"
        />
      </template>
    </MDC>
  </div>
</template>
