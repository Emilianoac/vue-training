<script setup lang="ts">
import {
  EyeIcon,
  FileCodeIcon,
  FlaskConicalIcon,
  Maximize2Icon,
  Minimize2Icon,
  RotateCcwIcon,
  SaveIcon,
} from "lucide-vue-next";
import type { EditorFileTab } from "@/lib/challenge-runners/webcontainer/types";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

defineProps<{
  canLoadSolution: boolean;
  canViewTests: boolean;
  canResetCode: boolean;
  canSaveCode: boolean;
  activeFilePath: string;
  dirtyFilePaths: string[];
  files: EditorFileTab[];
  isFullscreen: boolean;
}>();

defineEmits<{
  resetCode: [];
  saveCode: [];
  selectFile: [path: string];
  toggleFullscreen: [];
  viewSolution: [];
  viewTests: [];
}>();

const { t } = useI18n();
</script>

<template>
  <div
    class="z-1 flex items-center justify-between border-b border-(--editor-panel-border) bg-(--editor-panel-surface-background) p-2 shadow-(--editor-panel-shadow)"
  >
    <ul class="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-xs">
      <li v-for="file in files" :key="file.path" class="shrink-0">
        <button
          class="flex h-7 items-center gap-1.5 border-b-2 px-2 transition-colors"
          :class="
            file.path === activeFilePath
              ? 'border-(--editor-panel-tab-accent) text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          "
          type="button"
          @click="$emit('selectFile', file.path)"
        >
          <FlaskConicalIcon v-if="file.icon === 'test'" class="size-3" />
          <FileCodeIcon v-else class="size-3" />
          {{ file.label }}
          <span
            v-if="dirtyFilePaths.includes(file.path)"
            class="size-1.5 rounded-full bg-(--editor-panel-tab-accent)"
            aria-hidden="true"
          />
        </button>
      </li>
    </ul>
    <div class="flex items-center gap-2">
      <TooltipProvider>
        <div class="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                :aria-label="t('challenge.runner.actions.save')"
                :disabled="!canSaveCode"
                size="icon-sm"
                variant="ghost"
                @click="$emit('saveCode')"
              >
                <SaveIcon class="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ t("challenge.runner.actions.save") }}</p>
            </TooltipContent>
          </Tooltip>

          <span
            v-if="dirtyFilePaths.length > 0"
            class="hidden whitespace-nowrap text-xs text-muted-foreground sm:inline"
          >
            {{ t("challenge.runner.status.unsaved") }}
          </span>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                :aria-label="t('challenge.runner.actions.reset')"
                :disabled="!canResetCode"
                size="icon-sm"
                variant="ghost"
                @click="$emit('resetCode')"
              >
                <RotateCcwIcon class="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ t("challenge.runner.actions.reset") }}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                :aria-label="t('challenge.runner.actions.tests')"
                :disabled="!canViewTests"
                size="icon-sm"
                variant="ghost"
                @click="$emit('viewTests')"
              >
                <FlaskConicalIcon class="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ t("challenge.runner.actions.tests") }}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                :aria-label="t('challenge.runner.actions.solution')"
                :disabled="!canLoadSolution"
                size="icon-sm"
                variant="ghost"
                @click="$emit('viewSolution')"
              >
                <EyeIcon class="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ t("challenge.runner.actions.solution") }}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                :aria-label="
                  isFullscreen
                    ? t('challenge.runner.actions.exitFullscreen')
                    : t('challenge.runner.actions.enterFullscreen')
                "
                size="icon-sm"
                variant="ghost"
                @click="$emit('toggleFullscreen')"
              >
                <Minimize2Icon v-if="isFullscreen" class="size-3.5" />
                <Maximize2Icon v-else class="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {{
                  isFullscreen
                    ? t("challenge.runner.actions.exitFullscreen")
                    : t("challenge.runner.actions.enterFullscreen")
                }}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  </div>
</template>
