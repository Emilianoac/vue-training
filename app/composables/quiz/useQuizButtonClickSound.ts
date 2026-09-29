import buttonClickSoundUrl from "@/assets/audio/quiz/button-click-retro-reverb.wav?url";

const interactiveSelector =
  "button, [data-slot='button'], [role='button'], [data-quiz-click-target]";

let clickAudio: HTMLAudioElement | null = null;

export default function useQuizButtonClickSound() {
  function handleClick(event: MouseEvent) {
    if (!(event.target instanceof Element)) return;

    const interactiveElement = event.target.closest(interactiveSelector);
    if (
      !interactiveElement ||
      interactiveElement.matches(":disabled, [aria-disabled='true'], [data-selected='true']")
    ) {
      return;
    }

    const isInsideQuiz = interactiveElement.closest("[data-quiz-sound-scope]");
    const isInsideQuizDialog = interactiveElement.closest("[role='dialog']");
    if (!isInsideQuiz && !isInsideQuizDialog) return;

    if (!clickAudio) return;

    clickAudio.currentTime = 0;
    void clickAudio.play().catch(() => undefined);
  }

  onMounted(() => {
    if (!clickAudio) {
      clickAudio = new Audio(buttonClickSoundUrl);
      clickAudio.preload = "auto";
    }

    document.addEventListener("click", handleClick, true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClick, true);
  });
}
