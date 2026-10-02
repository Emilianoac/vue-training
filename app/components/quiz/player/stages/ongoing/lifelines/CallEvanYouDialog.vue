<script setup lang="ts">
import { ArrowRightIcon, PhoneIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import evanYouPortraitUrl from "@/assets/images/quiz/evan-you.jpg";
import QuizTypewriterText from "../QuizTypewriterText.vue";

const props = defineProps<{
  optionLabels: string[];
}>();

const emit = defineEmits<{
  resolved: [];
}>();

const open = defineModel<boolean>("open", { required: true });
const { t } = useI18n();
const typewriter = ref<{ complete: () => void } | null>(null);
const isDialogueComplete = ref(false);
const dialogueRun = ref(0);

const firstOption = computed(() => props.optionLabels[0] ?? "A");
const secondOption = computed(() => props.optionLabels[1] ?? "B");
const dialogue = computed(() =>
  t("quiz.lifeline.dialogue"),
);

watch(open, (isOpen) => {
  if (!isOpen) return;

  isDialogueComplete.value = false;
  dialogueRun.value += 1;
});

function completeDialogue() {
  typewriter.value?.complete();
}

function closeDialog() {
  if (!isDialogueComplete.value) return;

  emit("resolved");
  open.value = false;
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      :show-close-button="false"
      class="grid max-h-[calc(100dvh-2rem)] gap-0 border-primary/30 bg-slate-950 p-0 text-slate-100 sm:max-w-2xl"
      overlay-class="bg-background/75 backdrop-blur-sm"
      @escape-key-down.prevent
      @pointer-down-outside.prevent
    >
      <DialogTitle class="sr-only">{{ $t("quiz.lifeline.title") }}</DialogTitle>
      <DialogDescription class="sr-only">
        {{ $t("quiz.lifeline.description") }}
      </DialogDescription>

      <div class="relative flex min-h-0 flex-col">
        <img
          :src="evanYouPortraitUrl"
          class="absolute top-3 left-4 z-10 size-14 rounded-full border-2 border-primary bg-slate-950 object-cover sm:-top-10 sm:left-5 sm:size-24"
          alt="Evan You"
        />
        <div
          class="flex min-h-20 items-center justify-between gap-3 border-b border-white/10 py-3 pr-4 pl-20 text-[10px] tracking-wider uppercase sm:min-h-16 sm:gap-4 sm:pr-5 sm:pl-32 sm:text-xs sm:tracking-widest"
        >
          <span class="font-bold text-primary">Evan You</span>
          <span class="flex items-center gap-1.5 whitespace-nowrap text-emerald-300 sm:gap-2">
            <span class="relative flex size-2">
              <span
                class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60"
              ></span>
              <span class="relative inline-flex size-2 rounded-full bg-emerald-400"></span>
            </span>
            <PhoneIcon class="size-3.5" />
            {{ $t("quiz.lifeline.connected") }}
          </span>
        </div>

        <div class="flex flex-1 flex-col p-6 text-left">
          <QuizTypewriterText
            :key="dialogueRun"
            ref="typewriter"
            class="text-lg leading-8 font-medium"
            :html="dialogue"
            :start-delay="180"
            @completed="isDialogueComplete = true"
          />
          <button
            v-if="!isDialogueComplete"
            type="button"
            class="mt-5 w-fit cursor-pointer text-xs text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            @click="completeDialogue"
          >
            {{ $t("quiz.lifeline.skipDialogue") }}
          </button>

          <Transition name="lifeline-options">
            <div
              v-if="isDialogueComplete"
              class="mt-7 flex w-full items-center justify-center gap-3"
              aria-live="polite"
            >
              <template v-for="(optionLabel, index) in [firstOption, secondOption]" :key="optionLabel">
                <span
                  v-if="index > 0"
                  class="text-sm text-slate-400"
                  aria-hidden="true"
                >
                  {{ $t("quiz.lifeline.or") }}
                </span>
                <span
                  class="flex h-10 min-w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 px-4 font-mono text-xl font-bold text-primary"
                >
                  {{ optionLabel }}
                </span>
              </template>
            </div>
          </Transition>
        </div>

        <div class="flex justify-end border-t border-white/10 px-4 py-3">
          <Button
            variant="ghost"
            class="text-primary hover:bg-primary/10 hover:text-primary"
            :disabled="!isDialogueComplete"
            @click="closeDialog"
          >
            {{ $t("quiz.lifeline.thanks") }}
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.lifeline-options-enter-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

.lifeline-options-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}
</style>
