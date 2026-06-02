<script setup lang="ts">
import { HomeIcon, LightbulbIcon, RouteIcon, SwordsIcon, FileQuestion } from "lucide-vue-next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
  <div class="flex flex-col h-auto md:h-screen [--header-height:50px]">
    <HeaderComponent variant="learn" class="h-(--header-height) shrink-0 border-b" />
    <SidebarProvider class="flex-1! min-h-0! overflow-hidden!">
      <!-- Learn Sidebar -->
      <Sidebar
        class="top-(--header-height)! h-[calc(100svh-var(--header-height))]!"
        collapsible="icon"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Sections</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="item in menuItems" :key="item.title">
                  <SidebarMenuButton as-child :tooltip="$t(item.title)">
                    <NuxtLink
                      :to="item.url"
                      :class="{ 'bg-sidebar-accent': isMenuActive(item.url) }"
                    >
                      <div class="flex items-center gap-2">
                        <component :is="item.icon" class="size-4" />
                        <span>{{ $t(item.title) }}</span>
                      </div>
                    </NuxtLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <SidebarTrigger />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Toggle sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarFooter>
      </Sidebar>

      <!-- Learn content -->
      <SidebarInset class="flex flex-col min-h-0! overflow-hidden min-w-0!">
        <header class="flex md:hidden sticky top-0 bg-background px-6 py-1 border-b">
          <SidebarTrigger />
        </header>
        <div class="h-full overflow-auto p-6">
          <slot />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>

<style scoped></style>
