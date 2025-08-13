<script lang="ts" setup>
  import { useGeneralStore } from "@/stores/general";
  import { useRandomTip } from "@/composables/useRandomTip";
  import Vuecito from "@/components/illustrations/Vuecito.vue";
  import IconBook from "@/components/icons/IconBook.vue";

  const { randomTip, randomTips, markdownToHtml, getRandomTip, selectTip } = useRandomTip();
  
  const store = useGeneralStore();

</script>

<template>
  <!-- Hero Section -->
  <section class="mt-4">
    <div class="grid grid-cols-1 lg:grid-cols-[400px_1fr] place-items-start justify-center mt-10 w-full gap-4">
      <div class="w-full lg:sticky top-[100px]">
        <!-- Illustration -->
        <Vuecito 
          class="max-w-[100px] lg:max-w-[250px] w-full mx-auto h-auto" 
          :mood="randomTip.mood" 
          :tip-id="randomTip.id"
        />
        <!-- Get a new tip button -->
        <button
          class="app-button bg-gray-800 text-white dark:bg-white dark:text-black mx-auto w-max mt-10 text-sm lg:text-base !hidden lg:!flex font-semibold hover:opacity-85 transition-all duration-200"
          @click="getRandomTip"
        >
          {{ $t("randomTip.general.get_a_new_tip") }}
          <IconBook class="inline-block ml-2" width="24" height="24"/>
        </button>
      </div>

      <!-- Tip Content -->
      <div class="w-full">
        <transition name="fade" mode="out-in">
          <div class="tip-container" :key="randomTip.id" >
            <div class="tip-content">
              <!-- Tip explanation -->
              <div v-html="markdownToHtml"></div>
              <!-- Tip code examples -->
              <template v-if="randomTip.codeExamples.length">
                <highlightjs 
                  v-for="(codeExample, index) in randomTip.codeExamples" 
                  :key="index"
                  class="text-sm rounded-md overflow-hidden mt-4" 
                  :language="codeExample.lang" 
                  :code="codeExample.code[store.locale]"
                />
              </template>
              <!-- Source link -->
              <div v-if="randomTip.source" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span class="block">{{ $t("randomTip.general.source") }} </span>
                <a :href="randomTip.source" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">
                  {{ randomTip.source }}
                </a>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Get a new tip button -->
    <button
      class="app-button bg-gray-800 text-white dark:bg-white dark:text-black mx-auto w-max mt-10 text-sm lg:text-base lg:!hidden !flex font-semibold hover:opacity-85 transition-all duration-200"
      @click="getRandomTip">
        {{ $t("randomTip.general.get_a_new_tip") }}
    </button>
  </section>

  <hr class="my-10 w-full border-t border-gray-200 dark:border-gray-800"/>
  
  <!-- List of tips -->
  <section class="mt-10">
    <h2 class="text-2xl font-bold mb-4">{{ $t("randomTip.general.list_of_tips") }}</h2>
    <ul class="space-y-4">
      <li 
        v-for="tip in randomTips" 
        :key="tip.id" 
        :class="{ '!outline-color-primary': randomTip.id === tip.id }"
        class="block lg:flex items-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 rounded-md p-4 cursor-pointer hover:opacity-85 hover:shadow-sm transition-all duration-200 outline outline-2 outline-transparent dark:outline-transparent"
        @click="selectTip(tip)">
          <div class="bg-gray-100 dark:bg-slate-900 rounded-md p-3 w-12 h-12 mr-4 flex items-center justify-center">
            <img :src="tip.category.icon" alt="Category Icon"/>
          </div>
          <div>
            <span class="text-sm text-gray-600 dark:text-gray-300 mb-1 mt-5 lg:mt-0 block">{{ tip.category.name}}</span>
            <h4 class="font-bold mb-1"> {{ tip.title[store.locale] }} </h4>
            <p class="text-[0.92em]"> {{ tip.description[store.locale] }} </p>
          </div>
      </li>
    </ul>
  </section>
</template>

<style lang="postcss">

.tip-container {
  @apply bg-white border dark:bg-slate-800/50  border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden p-5;

  h2 {
    @apply text-[1.1em] lg:text-xl mb-4;
  }

  code:not(.hljs) {
    @apply bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-blue-200 px-1 py-0.5 rounded-md;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:  0.4s ease;
  transition-delay: 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
