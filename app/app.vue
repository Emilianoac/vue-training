<script lang="ts" setup>
const localeHead = useLocaleHead({
  lang: true,
  dir: true,
});

useHead(() => ({
  titleTemplate: (pageName) => {
    return pageName ? `${pageName} — Vue Training` : "Vue Training";
  },
  htmlAttrs: localeHead.value.htmlAttrs,
}));
</script>

<template>
  <NuxtLoadingIndicator color="#11ad68" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
