<script setup lang="ts">
import { HomeIcon, LightbulbIcon, RouteIcon, SwordsIcon, FileQuestion } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import HeaderComponent from "@/components/layout/HeaderComponent.vue";

const route = useRoute();

const menuItems = [
  { title: "menu-label.home", icon: HomeIcon, url: "/learn" },
  { title: "menu-label.learningPaths", icon: RouteIcon, url: "/learn/learning-paths" },
  { title: "menu-label.quizzes", icon: FileQuestion, url: "/learn/quizzes" },
  { title: "menu-label.challenges", icon: SwordsIcon, url: "/learn/challenges" },
  { title: "menu-label.tips", icon: LightbulbIcon, url: "/learn/tips" },
];

const isMenuActive = (url: string) => {
  const current = route.path.replace(/\/+$/, "");
  const target = url.replace(/\/+$/, "");
  if (target === "/learn") {
    return current === target;
  }
  return current === target || current.startsWith(target + "/");
};
</script>

<template>
  <div class="flex h-dvh flex-col">
    <HeaderComponent variant="learn" class="shrink-0 bg-background/95 backdrop-blur" />
    <div class="grid min-h-0 flex-1 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside class="hidden min-h-0 overflow-y-auto border-r bg-card/30 md:block">
        <div class="space-y-2 p-3">
          <span class="block text-sm text-muted-foreground">Sections</span>
          <nav>
            <ul class="space-y-2">
              <li v-for="item in menuItems" :key="item.title">
                <Button as-child variant="ghost" class="w-full justify-start">
                  <NuxtLink :to="item.url" :class="{ 'bg-sidebar-accent': isMenuActive(item.url) }">
                    <div class="flex items-center gap-2">
                      <component :is="item.icon" class="size-4" />
                      <span>{{ $t(item.title) }}</span>
                    </div>
                  </NuxtLink>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main class="min-w-0 overflow-y-auto p-4 md:p-6">
        <ScrollArea class="h-auto md:h-full md:pr-4">
          <slot />
        </ScrollArea>
      </main>
    </div>

    <div class="w-full px-4 bg-card border-t md:hidden">
      <ScrollArea>
        <nav
          class="flex justify-between shrink-0 gap-1 overflow-x-auto shadow pt-2 pb-3"
          aria-label="Learn sections"
        >
          <Button
            v-for="item in menuItems"
            :key="item.title"
            as-child
            variant="ghost"
            size="sm"
            class="shrink-0 px-1.5! gap-1"
          >
            <NuxtLink :to="item.url" :class="{ 'bg-sidebar-accent': isMenuActive(item.url) }">
              <component
                :is="item.icon"
                class="size-3"
                :class="{ 'text-primary': isMenuActive(item.url) }"
              />
              <span class="text-xs">{{ $t(item.title) }}</span>
            </NuxtLink>
          </Button>
        </nav>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  </div>
</template>

<style scoped></style>
