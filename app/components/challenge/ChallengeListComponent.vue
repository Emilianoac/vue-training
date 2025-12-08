<script lang="ts" setup>
import ChallengeCard from "@/components/challenge/ChallengeCard.vue";
import type { Challenge } from "@/types/challenge";

defineProps<{
  challenges: Challenge[];
}>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
    <ChallengeCard
      v-for="challenge in challenges" 
      :challenge="challenge"
    />
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
