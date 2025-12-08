<script lang="ts" setup>

</script>

<template>
  <div class="p-4 mb-4 text-sm  rounded-lg bg-white dark:bg-gray-800" role="alert">
    <p class="font-medium mb-2 text-yellow-800 dark:text-yellow-400">⚠️ 
      {{ $t("challenge.firefox_message.title") }}
    </p>
    <p>{{ $t("challenge.firefox_message.message_1") }}</p>
    <p class="mt-2">{{ $t("challenge.firefox_message.message_2") }}</p>
    <ul class="list-disc pl-5 mt-2">
      <li class="mb-2">{{ $t("challenge.firefox_message.option_1") }}</li>
      <li class="mb-2">{{ $t("challenge.firefox_message.option_2") }}</li>
      <li>{{ $t("challenge.firefox_message.option_3") }}</li>
    </ul>
    <p class="mt-2 text-xs">
      {{ $t("challenge.firefox_message.message_3") }}
      <a 
        href="https://developer.stackblitz.com/platform/webcontainers/browser-support#embedding" 
        target="_blank" 
        class="text-blue-600 underline">
          {{ $t("challenge.firefox_message.link") }}
      </a>
    </p>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
