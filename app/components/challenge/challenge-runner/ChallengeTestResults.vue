<script setup lang="ts">
import type { TestCaseResult } from "@/lib/challenge-runners/webcontainer/types";
import { ScrollArea } from "@/components/ui/scroll-area";

defineProps<{
  failed: number;
  passed: number;
  tests: TestCaseResult[];
  total: number;
}>();

const { t } = useI18n();
</script>

<template>
  <aside
    class="flex h-full flex-col border-l border-(--editor-panel-border) bg-(--editor-panel-background)"
  >
    <header class="flex w-full bg-(--editor-panel-surface-background) p-2">
      <span class="w-fit border-b border-(--editor-panel-tab-accent) pb-1 font-mono text-xs">
        {{ t("challenge.runner.results.title") }}
      </span>
    </header>

    <section class="min-h-0 flex-1 p-3">
      <ScrollArea class="h-full pr-5">
        <div class="space-y-3">
          <div v-if="total" class="grid grid-cols-3 gap-2">
            <div class="rounded-sm border border-(--editor-panel-border) p-2">
              <p class="font-mono text-[10px] uppercase text-muted-foreground">
                {{ t("challenge.runner.results.total") }}
              </p>
              <p class="font-mono text-lg text-foreground">{{ total }}</p>
            </div>
            <div
              class="rounded-sm border border-[color-mix(in_oklch,var(--editor-test-passed)_45%,transparent)] p-2"
            >
              <p class="font-mono text-[10px] uppercase text-muted-foreground">
                {{ t("challenge.runner.results.passed") }}
              </p>
              <p class="font-mono text-lg text-(--editor-test-passed)">{{ passed }}</p>
            </div>
            <div
              class="rounded-sm border border-[color-mix(in_oklch,var(--editor-test-failed)_45%,transparent)] p-2"
            >
              <p class="font-mono text-[10px] uppercase text-muted-foreground">
                {{ t("challenge.runner.results.failed") }}
              </p>
              <p class="font-mono text-lg text-(--editor-test-failed)">{{ failed }}</p>
            </div>
          </div>

          <div
            v-else
            class="rounded-sm border border-(--editor-panel-border) p-3 text-sm text-muted-foreground"
          >
            {{ t("challenge.runner.results.empty") }}
          </div>

          <ul v-if="tests.length" class="space-y-2">
            <li
              v-for="test in tests"
              :key="test.name"
              class="rounded-sm border border-(--editor-panel-border) p-2"
            >
              <div class="flex items-start gap-2">
                <span
                  class="mt-0.5 font-mono text-xs"
                  :class="
                    test.status === 'passed'
                      ? 'text-(--editor-test-passed)'
                      : 'text-(--editor-test-failed)'
                  "
                >
                  {{
                    test.status === "passed"
                      ? t("challenge.runner.results.pass")
                      : t("challenge.runner.results.fail")
                  }}
                </span>
                <p class="text-sm leading-snug text-foreground">{{ test.name }}</p>
              </div>
            </li>
          </ul>
        </div>
      </ScrollArea>
    </section>
  </aside>
</template>
