<script lang="ts" setup>
import ChallengeListComponent from "@/components/challenge/ChallengeListComponent.vue";

</script>

<template>
  <div class="mt-7">
    <h1 class="text-2xl md:text-3xl font-bold text-center">{{ $t("general.challenge.many")}}</h1>
    <ChallengeListComponent />
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
