import buttonHoverSoundUrl from "@/assets/audio/quiz/button-hover-retro.wav?url";

let hoverAudio: HTMLAudioElement | null = null;

export default function useQuizOptionHoverSound() {
  onMounted(() => {
    if (hoverAudio) return;

    hoverAudio = new Audio(buttonHoverSoundUrl);
    hoverAudio.preload = "auto";
  });

  function playHoverSound(event: PointerEvent) {
    if (event.pointerType === "touch" || !hoverAudio) return;

    hoverAudio.currentTime = 0;
    void hoverAudio.play().catch(() => undefined);
  }

  return {
    playHoverSound,
  };
}
