<script setup lang="ts">
import { ChevronDownIcon } from "lucide-vue-next";
import type { Challenge } from "@/schemas/challenge.schema";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

defineProps<{
  hint: Challenge["hints"][number];
  number: number;
}>();

const { t } = useI18n();
</script>

<template>
  <Collapsible class="rounded-md border bg-card data-[state=open]:bg-card">
    <CollapsibleTrigger as-child>
      <Button
        variant="ghost"
        class="group w-full data-[state=open]:rounded-br-none data-[state=open]:rounded-bl-none"
      >
        {{ t("challenge.description.hint", { number }) }}
        <ChevronDownIcon class="ml-auto group-data-[state=open]:rotate-180" />
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent class="flex flex-col items-start gap-2 p-2.5 text-sm">
      <h3 class="font-semibold text-foreground">{{ hint.title }}</h3>
      <p class="mt-1 text-muted-foreground">{{ hint.body }}</p>
    </CollapsibleContent>
  </Collapsible>
</template>
