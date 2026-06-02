<script lang="ts" setup>
import type { Tip } from "@/schemas/tip.schema";
import { DicesIcon } from "lucide-vue-next";
import useTipData from "@/composables/tip/useTipData";
import useRandomTip from "@/composables/tip/useRandomTip";
import Vuecito from "@/components/assets/illustrations/Vuecito.vue";
import IconDice from "@/components/assets/icons/IconDice.vue";
import TipList from "@/components/tip/TipList.vue";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

definePageMeta({
  menu: true,
  index: 4,
  titleKey: "menu-label.randomTip",
  icon: IconDice,
});
useStaticPageSeo("randomTips");

const { locale } = useI18n();
const { getTips, tips } = useTipData();

await getTips();
const { getRandomTip, currentRandomTip, selectTip } = useRandomTip(tips);

watch(
  () => locale.value,
  async () => {
    await getTips();
  },
);
</script>

<template>
  <div v-if="currentRandomTip">
    <div
      class="grid grid-cols-1 lg:grid-cols-[auto_1fr] md:h-87.5 max-w-225 mx-auto place-items-start justify-center w-full gap-4"
    >
      <div class="w-full">
        <Vuecito
          class="max-w-25 lg:max-w-50 w-full mx-auto h-auto"
          mood="surprised"
          :tip-id="currentRandomTip.id"
        />
        <Button
          variant="secondary"
          size="xl"
          class="hidden lg:flex mx-auto mt-4"
          @click="getRandomTip()"
        >
          {{ $t("randomTip.general.get_a_new_tip") }}
          <DicesIcon class="w-5 h-5" />
        </Button>
      </div>

      <transition name="fade" mode="out-in">
        <Card class="w-full h-full overflow-auto gap-[1em]" :key="currentRandomTip.id">
          <ScrollArea class="h-full">
            <CardHeader>
              <CardTitle class="text-xl font-bold">
                {{ currentRandomTip.title }}
              </CardTitle>
              <Button variant="link" as-child class="p-0! text-blue-500 w-fit h-auto text-xs">
                <a :href="currentRandomTip.source_url">
                  {{ currentRandomTip.source_url }}
                </a>
              </Button>
            </CardHeader>
            <CardContent class="mt-5">
              <TipDetails :tip="currentRandomTip" />
            </CardContent>
          </ScrollArea>
        </Card>
      </transition>
    </div>

    <!-- Get a new tip button mobile -->
    <Button
      type="button"
      variant="secondary"
      @click="getRandomTip()"
      class="mx-auto mt-8 lg:hidden! flex"
    >
      {{ $t("randomTip.general.get_a_new_tip") }}
    </Button>

    <hr class="my-10 w-full border-t border-gray-200 dark:border-gray-800" />
    <TipList
      :currentTip="currentRandomTip"
      :tips="tips"
      @select-tip="(tip: Tip) => selectTip(tip)"
    />
  </div>
</template>

<style lang="scss" scoped>
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
