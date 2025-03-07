<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGeneralStore } from "@/stores/general";
import challenges from "@/data/challenges";
import BadgeComponent from "@/components/BadgeComponent.vue";
import TabComponent from "@/components/TabComponent.vue";
import FirefoxAlertComponent from "@/components/FirefoxAlertComponent.vue";

const store = useGeneralStore();
const route = useRoute();
const router = useRouter();

const challenge = challenges.find((challenge) => challenge.id === route.params.id);

onMounted(() => {
  if (!challenge) {
    router.push({ name: "not-found" });
  }
});

const tabsItems = [
  { name: "challenge.tabs.description", id: "description" },
  { name : "challenge.tabs.play", id: "play" },
  { name: "challenge.tabs.solution", id: "solution" },
];
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
              <!-- Cover -->
              <img :src="challenge?.cover" alt="Cover" class="w-full rounded-md" />
  
              <!-- Gallery -->
               <div v-if="challenge?.images.length" class="mt-4">
                  <img v-for="(image, i) in challenge?.images" :key="i" :src="image" alt="Gallery" class="w-full rounded-md" />
               </div>
            </div>
          </div>
      </template>
  
      <template #play>
        <div class="my-5">
            <div class="grid grid-cols-1 lg:grid-cols-[0.3fr,1fr] gap-6">
              <div>
                <!-- Info -->
                <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
                  {{$t("challenge.play.info")}}
                </div>
      
                <!-- Instructions -->
                <p>
                  {{$t("challenge.play.instructions")}}
                  <code class="bg-gray-200 dark:bg-gray-800 dark:text-gray-300 p-1 rounded-md">npm run test:unit</code>
                </p>
                <p class="my-4">{{$t("challenge.play.instructions_2")}}</p>
  
                <hr class="my-4 dark:border-gray-700"/>
  
                <!-- Firefox Alert -->
                <FirefoxAlertComponent />
              </div>
  
              <!-- Playground -->
              <iframe
                class="w-full h-[500px]"
                :src="challenge?.stackblitz.challenge"
                frameborder="0"
                allowfullscreen>
              </iframe>
            </div>
          </div>
      </template>
  
      <template #solution>
        <div class="my-5">
            <div class="grid grid-cols-1 lg:grid-cols-[0.3fr,1fr] gap-6">
              <div>
                <FirefoxAlertComponent />
              </div>
  
              <!-- Playground -->
              <iframe
                class="w-full h-[500px]"
                :src="challenge?.stackblitz.solution"
                frameborder="0"
                allowfullscreen>
              </iframe>
            </div>
          </div>
      </template>
    </TabComponent>
  </template>
</template>

<style lang="postcss" scoped>
  
</style>
