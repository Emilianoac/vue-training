<script lang="ts" setup>

  useHead({
    titleTemplate: (pageName) => {
      return pageName ? `${pageName} — Vue Training` :  'Vue Training';
    }
  });
</script>

<template>
  <NuxtLoadingIndicator color="#11ad68"/>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>
