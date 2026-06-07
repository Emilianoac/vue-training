<script lang="ts" setup>
import type { Challenge } from "@/schemas/challenge.schema";

import ChipComponent from "@/components/ui/ChipComponent.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

defineProps<{
  challenge: Challenge;
}>();
</script>

<template>
  <Card class="p-0 hover:bg-card/80">
    <Button
      as-child
      variant="link"
      class="h-auto w-full block p-0 whitespace-break-spaces rounded-xl text-foreground decoration-0"
    >
      <NuxtLink class="block" :to="`/challenges/${challenge.slug}`" external>
        <CardContent class="px-0">
          <div class="relative overflow-hidden rounded-tr-xl rounded-tl-xl">
            <!-- Image -->
            <img
              :src="challenge.cover.url"
              alt="Challenge Image"
              class="w-full h-48 object-cover object-center"
            />
            <!-- Level Chip -->
            <ChipComponent
              :text="$t(`general.levels.${challenge.level}`)"
              :type="challenge.level"
              class="absolute top-3 right-3"
            />
          </div>
          <div class="p-4">
            <!-- Title -->
            <h3 class="text-sm font-bold line-clamp-1">{{ challenge.title }}</h3>
            <!-- Description -->
            <p
              class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-3"
              :title="challenge.short_description"
            >
              {{ challenge.short_description }}
            </p>
          </div>
        </CardContent>
      </NuxtLink>
    </Button>
  </Card>
</template>

<style lang="postcss" scoped></style>
