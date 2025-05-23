<script lang="ts" setup>
import { onMounted, watch} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGeneralStore } from "@/stores/general";
import challenges from "@/data/challenges";
import BadgeComponent from "@/components/BadgeComponent.vue";
import TabComponent from "@/components/TabComponent.vue";
import ChallengeCodeEditorLayout from "@/components/challenge/ChallengeCodeEditorLayout.vue";

const store = useGeneralStore();
const route = useRoute();
const router = useRouter();

const challenge = challenges.find((challenge) => challenge.id === route.params.id);

const tabsItems = [
  { name: "challenge.tabs.description", id: "description" },
  { name : "challenge.tabs.play", id: "play" },
  { name: "challenge.tabs.solution", id: "solution" },
];

onMounted(() => {
  if (!challenge) {
    router.push({ name: "not-found" });
  }
});

onMounted(() => {
  if (challenge) {
    document.title = `${challenge.title[store.locale]} - Vue Training`;
  }
});

watch(() => store.locale, () => {
  if (challenge) {
    document.title = `${challenge.title[store.locale]} - Vue Training`;
  }
});
</script>

<template>
  <template v-if="challenge">
    <div class="mt-10">
      <BadgeComponent class="mb-3" :type="challenge.level" :text="challenge.levelLabel[store.locale]" />
      <h1 class="text-2xl font-bold mb-2">{{ challenge.title[store.locale]}}</h1>
    </div>
  
    <TabComponent :items="tabsItems" id="challenge-tab">
      <template #description>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 my-5">
            <div>
              <!-- Description -->
              <p class="mt-5">{{ challenge?.description[store.locale]}}</p>
  
              <hr class="h-px my-8 bg-gray-300 border-0 dark:bg-gray-700">
  
              <!-- Objectives -->
              <h2 class="font-bold">{{$t('challenge.description.objectives')}}</h2>
              <ul class="mt-4 list-disc list-inside">
                <li v-for="(item, i) in challenge?.objectives[store.locale]" :key="i" class="mb-4">
                  {{ item }}
                </li>
              </ul>
            </div>
            <div>
              <!-- Gallery -->
               <div v-if="challenge?.images.length" class="mt-4">
                  <img v-for="(image, i) in challenge?.images" :key="i" :src="image" alt="Gallery" class="w-full rounded-md" />
               </div>
            </div>
          </div>
      </template>
  
      <template #play>
        <ChallengeCodeEditorLayout 
          :objectives="challenge?.objectives[store.locale]"
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
