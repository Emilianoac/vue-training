<script lang="ts" setup>
import CardComponent from "@/components/CardComponent.vue";
import type { Challenge } from "@/types/challenge";

defineProps<{
  challenges: Challenge[];
}>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
    <CardComponent
      v-for="challenge in challenges" 
      :key="challenge.id" 
      :title="challenge.title" 
      :level="challenge.level" 
      :level-label="challenge.levelLabel"
      :img="challenge.cover"
      :description="challenge.short_description"
      type="challenge"
      :link="`/challenges/${challenge.id}`"
    />
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
