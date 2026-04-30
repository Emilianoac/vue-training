<script lang="ts" setup>
const route = useRoute();
const pathId = route.params.pathId as string;
</script>

<template>
  <LearningPath :path-id="pathId" />
</template>
