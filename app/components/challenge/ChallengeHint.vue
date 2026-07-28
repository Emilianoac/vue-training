<script setup lang="ts">
import { ChevronDownIcon } from "lucide-vue-next";
import type { Challenge } from "@/schemas/challenge.schema";
import useMarkdownParser from "@/composables/useMarkdownParser";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const props = defineProps<{
  hint: Challenge["hints"][number];
  number: number;
}>();

const { t } = useI18n();
const { parse } = useMarkdownParser();

const parsedBody = computed(() => parse(props.hint.body));
</script>

<template>
  <Collapsible class="rounded-md border bg-card data-[state=open]:bg-card">
    <CollapsibleTrigger as-child>
      <Button
        variant="ghost"
        class="group w-full data-[state=open]:rounded-br-none data-[state=open]:rounded-bl-none data-[state=open]:border-b"
      >
        {{ t("challenge.description.hint", { number }) }}
        <ChevronDownIcon class="ml-auto group-data-[state=open]:rotate-180" />
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent class="p-3">
      <h3 class="font-semibold text-foreground">{{ hint.title }}</h3>
      <div
        class="mt-4 min-w-0 text-muted-foreground text-sm [&_ol]:mt-2 [&_ol]:list-inside [&_ol]:list-decimal [&_p+p]:mt-3 [&_pre]:mt-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:bg-muted [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:mt-2 [&_ul]:list-inside [&_ul]:list-disc [&_p]:leading-7"
        v-html="parsedBody"
      ></div>
    </CollapsibleContent>
  </Collapsible>
</template>
