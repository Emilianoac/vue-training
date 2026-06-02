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
import type { ChallengeFile } from "@/lib/challenge-runners/webcontainer/types";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

defineProps<{
  canLoadSolution: boolean;
  canResetCode: boolean;
  canSaveCode: boolean;
  fileIcon: ChallengeFile["icon"];
  fileLabel: string;
  isFullscreen: boolean;
}>();

defineEmits<{
  loadSolution: [];
  resetCode: [];
  saveCode: [];
  toggleFullscreen: [];
}>();

const { t } = useI18n();
</script>

<template>
  <div
    class="z-1 flex items-center justify-between border-b border-(--editor-panel-border) bg-(--editor-panel-surface-background) p-2 shadow-(--editor-panel-shadow)"
  >
    <ul class="w-fit text-xs">
      <li class="flex items-center gap-1 border-b-2 border-(--editor-panel-tab-accent) pb-1">
        <FlaskConicalIcon v-if="fileIcon === 'test'" class="size-3" />
        <FileCodeIcon v-else class="size-3" />
        {{ fileLabel }}
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
                :aria-label="t('challenge.runner.actions.solution')"
                :disabled="!canLoadSolution"
                size="icon-sm"
                variant="ghost"
                @click="$emit('loadSolution')"
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
