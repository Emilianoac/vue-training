<script lang="ts" setup>
import { onMounted, watch} from "vue";
import { useRoute, useRouter } from "vue-router";
import BadgeComponent from "@/components/ui/BadgeComponent.vue";
import TabComponent from "@/components/ui/TabComponent.vue";
import ChallengeCodeEditorLayout from "@/components/challenge/ChallengeCodeEditorLayout.vue";
import useChallengeData from "@/composables/challenge/useChallengeData";

const route = useRoute();

const { locale } = useI18n();

const {challenge, getChallenge} = useChallengeData();
await getChallenge(route.params.id as string)

const tabsItems = [
  { name: "challenge.tabs.description", id: "description", icon: "mdi:list-box" },
  { name : "challenge.tabs.play", id: "play", icon: "mdi:gamepad-square" },
  { name: "challenge.tabs.solution", id: "solution", icon: "mdi:crystal-ball" },
];

useSeoMeta({
  title: computed(() => challenge.value?.title)
})

watch(() => locale.value, async () => {
  await getChallenge(route.params.id as string);
});
</script>

<template>
  <template v-if="challenge">
    <div class="mt-10">
      <BadgeComponent class="mb-3" :type="challenge.level" :text="$t(`general.levels.${challenge.level}`)" />
      <h1 class="text-2xl font-bold mb-2">{{ challenge.title}}</h1>
    </div>
  
    <TabComponent :items="tabsItems" id="challenge-tab">
      <template #description>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 my-5">
            <div>
              <!-- Description -->
              <p class="mt-5">{{ challenge?.description}}</p>
  
              <hr class="h-px my-8 bg-gray-300 border-0 dark:bg-gray-700">
  
              <!-- Objectives -->
              <h2 class="font-bold">{{$t('challenge.description.objectives')}}</h2>
              <ul class="list-disc list-inside text-gray-900 dark:text-gray-300 text-sm p-4 rounded-md bg-slate-100 dark:bg-slate-800/50 mt-2">
                <li v-for="(item, i) in challenge?.objectives" :key="i" class="mb-4 last-of-type:mb-0">
                  {{ item.data }}
                </li>
              </ul>
            </div>
            <div>
              <!-- Gallery -->
               <div v-if="challenge?.images.length" class="mt-4 bg-blue-50/80 p-3 rounded-md">
                  <img v-for="(image, i) in challenge?.images" :key="i" :src="image.url" alt="Gallery" class="w-full rounded-md" />
               </div>
            </div>
          </div>
      </template>
  
      <template #play>
        <ChallengeCodeEditorLayout 
          :objectives="challenge?.objectives"
          :stackblitzUrl="challenge?.stackblitz.challenge" 
        />
      </template>
  
      <template #solution>
        <ChallengeCodeEditorLayout 
          :stackblitzUrl="challenge?.stackblitz.solution" 
        />
      </template>
    </TabComponent>
  </template>
</template>

<style lang="postcss" scoped>
  
</style>
