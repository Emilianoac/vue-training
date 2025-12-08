<script lang="ts" setup>

  useHead({
    titleTemplate: (pageName) => {
      return pageName ? `${pageName} — Vue Training` :  'Vue Training';
    }
  });
</script>

<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>
