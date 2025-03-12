<script lang="ts" setup>

</script>

<template>
  <div class="flex items-center justify-center h-[calc(100vh-200px)]">
    <div class="text-center">
      <h1 class="text-6xl md:text-9xl font-bold">404</h1>
      <p class="text-xl md:text-2xl mt-4">{{ $t("general.pageNotFound") }}</p>
      <router-link to="/" class="app-button primary mt-8">
        {{ $t("general.goToHome") }}
      </router-link>
    </div>
  </div>
</template>
