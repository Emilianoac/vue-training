<script lang="ts" setup>
import { LightbulbIcon } from "lucide-vue-next";
import useTipData from "@/composables/tip/useTipData";
import Vuecito from "@/components/assets/illustrations/Vuecito.vue";
import TipDetails from "@/components/tip/TipDetails.vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

const { locale } = useI18n();
const { getTips, tips } = useTipData();

await getTips();

watch(
  () => locale.value,
  async () => {
    await getTips();
  },
);
</script>

<template>
  <Card>
    <CardContent>
      <div class="grid md:grid-cols-[auto_1fr] items-center gap-4 col-span-2">
        <Vuecito tip-id="tip-widget" class="max-w-20 h-auto" :show-code-editor="false" />

        <Carousel
          class="relative w-full overflow-hidden"
          :opts="{
            align: 'start',
          }"
        >
          <CarouselContent>
            <CarouselItem v-for="(tip, index) in tips" :key="index">
              <div class="p-1 space-y-3">
                <div class="select-none">
                  <h4 class="flex items-center gap-2 text-lg font-semibold mb-1">
                    <LightbulbIcon class="text-yellow-500" />
                    {{ tip.title }}
                  </h4>
                  <p class="text-[0.92em]">{{ tip.short_description }}</p>
                </div>
                <Dialog>
                  <DialogTrigger :as-child="true">
                    <Button size="sm" variant="outline"> Read more </Button>
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-3xl w-full">
                    <DialogHeader>
                      <DialogTitle class="font-bold">{{ tip.title }}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea class="h-[80vh] pr-4 overflow-x-hidden">
                      <TipDetails :tip="tip" />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselDots />
        </Carousel>
      </div>
    </CardContent>
  </Card>
</template>

<style lang="scss"></style>
