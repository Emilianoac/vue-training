<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const props = defineProps<{
  lesson: Record<string, unknown>;
}>();

const { t } = useI18n();

const sectionBlocks = computed(() => {
  const body = props.lesson.body as { value?: unknown[] } | undefined;
  const blocks = body?.value;

  if (!blocks?.length) return [];

  const sections: unknown[][] = [];
  let current: unknown[] = [];

  for (const block of blocks) {
    if ((block as unknown[])[0] === "h2") {
      if (current.length) sections.push(current);
      current = [block];
    } else {
      current.push(block);
    }
  }

  if (current.length) sections.push(current);

  return sections.length ? sections : [blocks];
});

const totalSections = computed(() => sectionBlocks.value.length);
const lessonSections = computed(() =>
  sectionBlocks.value.map((blocks, index) => getSectionDetails(blocks, index)),
);

function getSectionValue(blocks: unknown[]) {
  const body = props.lesson.body as Record<string, unknown> | undefined;
  return {
    ...props.lesson,
    body: { ...body, value: blocks },
  } as Record<string, unknown>;
}

function getSectionDetails(blocks: unknown[], index: number) {
  const heading = blocks.find((block) => Array.isArray(block) && block[0] === "h2");
  if (!Array.isArray(heading)) {
    return {
      id: `lesson-section-${index + 1}`,
      title: `${index + 1}`,
      usesHeadingId: false,
    };
  }

  const attrs = isRecord(heading[1]) ? heading[1] : null;
  const content = attrs ? heading.slice(2) : heading.slice(1);

  return {
    id: typeof attrs?.id === "string" ? attrs.id : `lesson-section-${index + 1}`,
    title: extractText(content) || `${index + 1}`,
    usesHeadingId: typeof attrs?.id === "string",
  };
}

function extractText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(extractText).join("");
  return "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
</script>

<template>
  <article class="flex h-full min-h-0 flex-col">
    <div class="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-6 overflow-hidden p-4">
      <aside class="hidden xl:block">
        <div class="sticky flex flex-col justify-between top-0 rounded-md border bg-card p-6">
          <nav class="space-y-1">
            <ul>
              <li v-for="section in lessonSections" :key="section.id" class="border-b pb-2 mb-2">
                <Button
                  class="text-foreground w-full justify-start px-1 h-auto whitespace-break-spaces"
                  variant="link"
                  as-child
                >
                  <a :href="`#${section.id}`"> {{ section.title }} </a>
                </Button>
              </li>
            </ul>
          </nav>
          <slot name="aside-actions" :total-sections="totalSections" :sections="lessonSections" />
        </div>
      </aside>

      <main class="lesson-container overflow-hidden">
        <div class="bg-card rounded-md border p-6 h-full">
          <ScrollArea class="h-full pr-4">
            <ContentRenderer
              v-for="(blocks, index) in sectionBlocks"
              :key="index"
              :id="lessonSections[index]?.usesHeadingId ? undefined : lessonSections[index]?.id"
              :value="getSectionValue(blocks)"
            />
          </ScrollArea>
        </div>

        <slot name="actions" :total-sections="totalSections" />
      </main>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.lesson-container {
  :deep(h2) {
    font-weight: 600;
    font-size: 1.2rem;
    border-bottom: 3px solid var(--primary);
    margin-bottom: 1.2rem;
    padding-bottom: 0.25rem;
    width: fit-content;
  }

  :deep(h3) {
    font-weight: 600;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    border-left: 6px solid var(--primary);
    padding-left: 0.3rem;
    line-height: 1;
  }

  :deep(p) {
    font-size: 0.95rem;
    margin-bottom: 1rem;
    line-height: 1.8;

    & :last-of-type {
      margin-bottom: 0;
    }
  }

  :deep(ul) {
    list-style: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    padding: 1rem;
    padding-left: 2rem;

    li {
      margin-bottom: 0.5rem;
      padding-bottom: 0.5rem;
      line-height: 1.9;
      border-bottom: 1px solid var(--border);
      font-size: 0.95rem;

      &::marker {
        color: var(--primary);
      }

      &:last-of-type {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
    }

    & :last-of-type {
      margin-bottom: 0;
    }
  }

  :deep(hr) {
    margin: 2rem 0;
    border-bottom: 1px solid var(--border);
  }
}
</style>
