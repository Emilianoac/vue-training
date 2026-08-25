<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { Copy, Check } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const props = defineProps(["code", "language", "filename", "class"]);

const { copy, copied } = useClipboard({
  source: props.code as string,
});
</script>

<template>
  <div class="border rounded-md overflow-hidden mb-5 last:mb-0">
    <div class="bg-card flex items-center justify-between px-4 py-1 border-b">
      <span class="text-sm text-muted-foreground">{{ filename || language }}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button @click="copy()" variant="ghost" size="sm" class="gap-2">
              <component :is="copied ? Check : Copy" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ copied ? "Copied!" : "Copy to clipboard" }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <ScrollArea type="auto" class="bg-card/50">
      <pre class="p-4 overflow-x-auto text-sm" :class="$props.class"><slot /></pre>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  </div>
</template>

<style scoped></style>
