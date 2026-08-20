<script lang="ts" setup>
import type { ChallengeListItem } from "@/schemas/challenge.schema";

import ActivityLevelBadge from "@/components/activity/ActivityLevelBadge.vue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

defineProps<{
  challenge: ChallengeListItem;
}>();
</script>

<template>
  <Card class="p-0 hover:bg-card/80">
    <Button
      as-child
      variant="link"
      class="h-auto w-full block p-0 whitespace-break-spaces rounded-xl text-foreground hover:no-underline"
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
            <ActivityLevelBadge
              :text="$t(`general.levels.${challenge.level}`)"
              :type="challenge.level"
              class="absolute top-3 right-3"
            />
          </div>
          <div class="p-4">
            <!-- Category -->
            <p class="text-sm opacity-70 mb-2">
              {{ challenge.category.name }} - {{ challenge.subCategory.name }}
            </p>
            <!-- Title -->
            <h3 class="text-sm font-bold line-clamp-1">{{ challenge.title }}</h3>
            <!-- Description -->
            <p
              class="mt-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400"
              :title="challenge.short_description"
            >
              {{ challenge.short_description }}
            </p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <Badge
                v-for="topic in challenge.topics"
                :key="topic.id"
                class="border-transparent bg-black text-xs font-normal text-white dark:bg-white dark:text-black"
              >
                {{ topic.label }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </NuxtLink>
    </Button>
  </Card>
</template>

<style lang="postcss" scoped></style>
