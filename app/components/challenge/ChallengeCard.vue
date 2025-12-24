<script lang="ts" setup>
  import type { Challenge } from "@/types/challenge";

  import BadgeComponent from "@/components/ui/BadgeComponent.vue";
  import CardComponent from"@/components/ui/CardComponent.vue";

  defineProps<{
    challenge : Challenge;
  }>();
</script>

<template>
  <CardComponent>
    <router-link class="block" :to="`/challenges/${challenge.slug}`">
      <div class="relative">
        <!-- Image -->
        <img :src="challenge.cover.url" alt="Challenge Image" class="w-full h-48 object-cover object-center">
        <!-- Level Badge -->
        <BadgeComponent :text="challenge.level" :type="challenge.level" class="absolute top-3 right-3"/>
      </div>
      <div class="p-4">
        <!-- Title -->
        <h3 class="text-sm font-bold line-clamp-1">{{ challenge.title }}</h3>
        <!-- Description -->
        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-3" :title="challenge.short_description">
          {{ challenge.short_description }}
        </p>
      </div>
    </router-link>
  </CardComponent>
</template>

<style lang="postcss" scoped>
  
</style>
