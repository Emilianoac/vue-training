<script lang="ts" setup>
import challenges from "@/data/challenges";
import ChallengeCardComponent from "@/components/challenge/ChallengeCardComponent.vue";

</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
    <ChallengeCardComponent 
      v-for="challenge in challenges" 
      :key="challenge.id" 
      :name="challenge.title" 
      :level="challenge.level" 
      :level-label="challenge.levelLabel"
      :img="challenge.cover"
      :description="challenge.short_description"
      :id="challenge.id" 
    />
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
