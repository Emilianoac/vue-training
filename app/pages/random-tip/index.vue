<script lang="ts" setup>
  import { marked } from "marked";
  import Vuecito from "@/components/assets/illustrations/Vuecito.vue";
  import IconBook from "@/components/assets/icons/IconBook.vue";
  import useRandomTipData from "@/composables/random-tip/useRandomTipData";
  import useRandomTipGame  from "@/composables/random-tip/useRandomTipGame";

  definePageMeta({ menu: true, titleKey: "menu-label.randomTip" });
  useStaticPageSeo("randomTips");

  const { locale } = useI18n();

  const { getRandomTips, randomTips} = useRandomTipData();

  await getRandomTips();

  const { selectTip, getRandomTip, currentRandomTip  } = useRandomTipGame(randomTips);
  
  watch(() => locale.value, async () => {
    await getRandomTips();
  });
</script>

<template>
  <div v-if="currentRandomTip">
    <!-- Hero Section -->
    <section class="mt-4">
      <div class="grid grid-cols-1 lg:grid-cols-[400px_1fr] place-items-start justify-center mt-10 w-full gap-4">
        <div class="w-full lg:sticky top-[100px]">
          <!-- Illustration -->
          <Vuecito 
            class="max-w-[100px] lg:max-w-[250px] w-full mx-auto h-auto" 
            mood="surprised"
            :tip-id="currentRandomTip.documentId"
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
            <div class="tip-container" :key="currentRandomTip.documentId" >
              <div class="tip-content">
                <!-- Tip explanation -->
                <div v-html="marked(currentRandomTip.content)"></div>
                <!-- Tip code examples -->
                <ClientOnly>
                  <template v-if="currentRandomTip.code_examples.length">
                    <highlightjs 
                      v-for="(codeExample, index) in currentRandomTip.code_examples" 
                      :key="index"
                      class="text-sm rounded-md overflow-hidden mt-4" 
                      :language="codeExample.lang" 
                      :code="codeExample.code"
                    />
                  </template>
                </ClientOnly>
                <!-- Source link -->
                <div v-if="currentRandomTip.source_url" class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <span class="block">{{ $t("randomTip.general.source") }} </span>
                  <a :href="currentRandomTip.source_url" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">
                    {{ currentRandomTip.source_url }}
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
          :key="tip.documentId" 
          :class="{ '!outline-color-primary': currentRandomTip.documentId === tip.documentId }"
          class="block lg:flex items-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 rounded-md p-4 cursor-pointer hover:opacity-85 hover:shadow-sm transition-all duration-200 outline outline-2 outline-transparent dark:outline-transparent"
          @click="selectTip(tip)">
            <div class="bg-gray-100 dark:bg-slate-900 rounded-md p-3 w-12 h-12 mr-4 flex items-center justify-center">
              <img :src="tip.category.image.url" alt="Category Icon"/>
            </div>
            <div>
              <span class="text-sm text-gray-600 dark:text-gray-300 mb-1 mt-5 lg:mt-0 block">{{ tip.category.name}}</span>
              <h4 class="font-bold mb-1"> {{ tip.title }} </h4>
              <p class="text-[0.92em]"> {{ tip.short_description }} </p>
            </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="postcss">

.tip-container {
  @apply bg-white border dark:bg-slate-800/50  border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden p-5;

  h2 {
    @apply text-[1.1em] lg:text-xl mb-4;
  }

  p {
    margin-bottom: 1em;

    code {
      white-space: nowrap;
    }
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
