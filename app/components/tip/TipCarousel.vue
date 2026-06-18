<script lang="ts" setup>
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

const { locale } = useI18n();
const { getTips, tips } = useTipData();

await getTips(3);

watch(
  () => locale.value,
  async () => {
    await getTips(3);
  },
);
</script>

<template>
  <Card>
    <CardContent>
      <div class="grid md:grid-cols-[auto_1fr] items-center gap-4 col-span-2">
        <Vuecito
          tip-id="tip-widget"
          class="mx-auto max-w-20 md:max-w-25 h-auto"
          :show-code-editor="false"
        />

        <Carousel
          class="relative w-full overflow-hidden md:flex gap-4"
          :opts="{
            align: 'start',
            loop: true,
          }"
        >
          <CarouselContent>
            <CarouselItem v-for="(tip, index) in tips" :key="index">
              <div class="p-1 space-y-3">
                <div class="select-none">
                  <h4 class="text-lg font-semibold mb-1">
                    {{ tip.title }}
                  </h4>
                  <p class="text-[0.85em]">{{ tip.short_description }}</p>
                </div>
                <Dialog>
                  <DialogTrigger :as-child="true">
                    <Button size="sm" variant="outline"> Read more </Button>
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-3xl w-full">
                    <DialogHeader>
                      <DialogTitle class="font-bold">{{ tip.title }}</DialogTitle>
                      <Button
                        variant="link"
                        as-child
                        class="p-0! text-blue-500 text-xs h-auto w-fit"
                      >
                        <a
                          :href="tip.source_url"
                          title="Source URL"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {{ tip.source_url }}
                        </a>
                      </Button>
                    </DialogHeader>
                    <ScrollArea class="overflow-x-hidden h-[60vh]">
                      <TipDetails :tip="tip" class="p-6 bg-card h-full" />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselDots class="flex md:flex-col justify-center" />
        </Carousel>
      </div>
    </CardContent>
  </Card>
</template>

<style lang="scss"></style>
