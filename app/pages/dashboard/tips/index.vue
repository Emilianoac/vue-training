<script lang="ts" setup>
import useRandomTipData from "@/composables/random-tip/useRandomTipData";
import useRandomTipGame from "@/composables/random-tip/useRandomTipGame";
import useMarkdownParser from "@/composables/useMarkdownParser";

import Vuecito from "@/components/assets/illustrations/Vuecito.vue";
import IconBook from "@/components/assets/icons/IconBook.vue";
import { Button } from "@/components/ui/button";
import IconDice from "@/components/assets/icons/IconDice.vue";

definePageMeta({
  menu: true,
  index: 4,
  titleKey: "menu-label.randomTip",
  icon: IconDice,
});
useStaticPageSeo("randomTips");

const { locale } = useI18n();
const { getRandomTips, randomTips } = useRandomTipData();
const { parse } = useMarkdownParser();

await getRandomTips();
const { selectTip, getRandomTip, currentRandomTip } = useRandomTipGame(randomTips);

const parsedExplanation = computed(() => {
  if (!currentRandomTip.value) return "";
  return parse(currentRandomTip.value.content);
});

watch(
  () => locale.value,
  async () => {
    await getRandomTips();
  },
);
</script>

<template>
  <div v-if="currentRandomTip">
    <!-- Hero Section -->
    <section>
      <div
        class="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] place-items-start justify-center w-full gap-4"
      >
        <!-- Illustration -->
        <div class="w-full">
          <Vuecito
            class="max-w-[100px] lg:max-w-[200px] w-full mx-auto h-auto"
            mood="surprised"
            :tip-id="currentRandomTip.documentId"
          />
          <!-- Get a new tip button -->
          <Button
            variant="secondary"
            size="xl"
            class="hidden lg:flex mx-auto mt-4"
            @click="getRandomTip"
          >
            {{ $t("randomTip.general.get_a_new_tip") }}
            <IconBook width="24" height="24" />
          </Button>
        </div>

        <!-- Tip Content -->
        <transition name="fade" mode="out-in">
          <div
            class="tip-container bg-card border md:max-h-[450px] w-full rounded-lg overflow-auto p-4 md:p-7"
            :key="currentRandomTip.documentId"
          >
            <div>
              <!-- Tip explanation -->
              <div v-html="parsedExplanation"></div>

              <!-- Source link -->
              <div
                v-if="currentRandomTip.source_url"
                class="mt-4 text-sm text-gray-500 dark:text-gray-400"
              >
                <span class="block mb-1 text-sm">{{ $t("randomTip.general.source") }} </span>
                <a
                  :href="currentRandomTip.source_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ currentRandomTip.source_url }}
                </a>
              </div>

              <hr class="my-6 border-t border-gray-200 dark:border-gray-800" />

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
            </div>
          </div>
        </transition>
      </div>

      <!-- Get a new tip button mobile -->
      <Button
        type="button"
        variant="secondary"
        @click="getRandomTip"
        class="mx-auto mt-8 lg:hidden! flex"
      >
        {{ $t("randomTip.general.get_a_new_tip") }}
        <IconBook width="24" height="24" />
      </Button>
    </section>

    <hr class="my-10 w-full border-t border-gray-200 dark:border-gray-800" />

    <!-- List of tips -->
    <section class="mt-10">
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <li
          v-for="tip in randomTips"
          :key="tip.documentId"
          :class="{ 'outline-primary!': currentRandomTip.documentId === tip.documentId }"
          class="block items-center border bg-card rounded-md p-4 cursor-pointer hover:opacity-85 hover:shadow-sm transition-all duration-200 outline outline-2 outline-transparent dark:outline-transparent"
          @click="selectTip(tip)"
        >
          <div
            class="bg-gray-100 dark:bg-slate-900 rounded-md p-3 w-12 h-12 mr-4 flex items-center justify-center"
          >
            <img :src="tip.category.image.url" alt="Category Icon" />
          </div>
          <div>
            <span class="text-sm text-gray-600 dark:text-gray-300 mb-1 mt-5 lg:mt-0 block">
              {{ tip.category.name }}
            </span>
            <h4 class="font-bold mb-1">{{ tip.title }}</h4>
            <p class="text-[0.92em]">{{ tip.short_description }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
.tip-container {
  h2 {
    font-size: 1.2em;
    margin-bottom: 0.5em;
  }

  p {
    margin-bottom: 1em;

    code {
      white-space: nowrap;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.4s ease;
  transition-delay: 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
