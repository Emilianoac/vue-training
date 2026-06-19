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
  layout: "learn",
  menu: true,
  index: 4,
  titleKey: "menu-label.randomTip",
  icon: IconDice,
});
useStaticPageSeo("tips");

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
  <div class="@container/tips h-full">
    <div
      v-if="currentRandomTip"
      class="grid grid-cols-1 @4xl:grid-cols-[auto_minmax(0,1fr)_300px] @4xl:h-full gap-8"
    >
      <div class="w-full @4xl:min-h-0">
        <Vuecito
          class="max-w-25 @4xl:max-w-50 w-full mx-auto h-auto"
          mood="surprised"
          :tip-id="currentRandomTip.documentId"
        />
        <Button variant="secondary" size="xl" class="flex mx-auto mt-4" @click="getRandomTip()">
          {{ $t("randomTip.general.get_a_new_tip") }}
          <DicesIcon class="w-5 h-5" />
        </Button>
      </div>

      <transition name="fade" mode="out-in">
        <Card class="w-full @4xl:h-full min-h-10 pt-2" :key="currentRandomTip.documentId">
          <CardHeader class="border-b pb-3!">
            <CardTitle class="text-lg font-semibold">
              {{ currentRandomTip.title }}
            </CardTitle>
            <Button
              variant="link"
              as-child
              class="p-0 text-blue-500 w-fit h-auto text-xs whitespace-break-spaces"
            >
              <a :href="currentRandomTip.source_url">
                {{ currentRandomTip.source_url }}
              </a>
            </Button>
          </CardHeader>
          <CardContent class="mt-5 overflow-hidden">
            <ScrollArea class="h-full @4xl:pr-4">
              <TipDetails :tip="currentRandomTip" />
            </ScrollArea>
          </CardContent>
        </Card>
      </transition>
      <div class="min-h-0 w-full @4xl:h-full">
        <TipList
          :currentTip="currentRandomTip"
          :tips="tips"
          @select-tip="(tip: Tip) => selectTip(tip)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity, transform;
  transition: 0.4s ease;
  transition-delay: 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
