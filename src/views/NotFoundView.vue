<script lang="ts" setup>

</script>

<template>
  <div class="flex items-center justify-center h-[calc(100vh-200px)]">
    <div class="text-center">
      <h1 class="text-6xl md:text-9xl font-bold text-color-primary">404</h1>
      <p class="text-xl md:text-2xl mt-4">{{ $t("general.pageNotFound") }}</p>
      <router-link to="/" class="mt-4 inline-block bg-blue-600 rounded-full px-6 py-2 text-white">
        {{ $t("general.goToHome") }}
      </router-link>
    </div>
  </div>
</template>
