<script setup lang="ts">
import { ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import DefaultLayout from "@/layout/DefaultLayout.vue";

const { t, locale } = useI18n();
const route = useRoute();
const isLoading = ref(false);

watch(route, () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

watch(locale, () => {
  const titleKey = route.meta.titleKey as string | undefined;
  if (titleKey) {
    document.title = `${t(titleKey)} - Vue Training`;
  }
});
</script>

<template>
  <div v-if="isLoading" class="progress-bar bg-color-primary"></div>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<style scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  animation: loading 0.5s ease-in-out infinite;
}

@keyframes loading {
  0% { width: 0%; }
  100% { width: 100%; }
}
</style>
