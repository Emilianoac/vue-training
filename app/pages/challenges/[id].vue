<script lang="ts" setup>
import { onMounted, watch} from "vue";
import { useRoute, useRouter } from "vue-router";
import BadgeComponent from "@/components/ui/BadgeComponent.vue";
import TabComponent from "@/components/ui/TabComponent.vue";
import ChallengeCodeEditorLayout from "@/components/challenge/ChallengeCodeEditorLayout.vue";
import useChallengeData from "@/composables/challenge/useChallengeData";

const route = useRoute();
const router = useRouter();

const { locale } = useI18n();

const {challenge, getChallenge} = useChallengeData();
await getChallenge(route.params.id as string)

const tabsItems = [
  { name: "challenge.tabs.description", id: "description" },
  { name : "challenge.tabs.play", id: "play" },
  { name: "challenge.tabs.solution", id: "solution" },
];

onMounted(() => {
  if (challenge) {
    document.title = `${challenge.value?.title} - Vue Training`;
  } else {
    router.push({ name: "not-found" });
  }
});

watch(() => locale.value, () => {
  if (challenge) {
    document.title = `${challenge.value?.title} - Vue Training`;
  }
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 my-5">
            <div>
              <!-- Description -->
              <p class="mt-5">{{ challenge?.description}}</p>
  
              <hr class="h-px my-8 bg-gray-300 border-0 dark:bg-gray-700">
  
              <!-- Objectives -->
              <h2 class="font-bold">{{$t('challenge.description.objectives')}}</h2>
              <ul class="mt-4 list-disc list-inside">
                <li v-for="(item, i) in challenge?.objectives" :key="i" class="mb-4">
                  {{ item.data }}
                </li>
              </ul>
            </div>
            <div>
              <!-- Gallery -->
               <div v-if="challenge?.images.length" class="mt-4">
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
