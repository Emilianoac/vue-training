import questionCharacterSoundUrl from "@/assets/audio/quiz/question-character-retro.wav?url";

const audioPool: HTMLAudioElement[] = [];
const playbackRates = [0.96, 1, 1.04];
const CHARACTER_SOUND_VOLUME = 0.55;
let nextAudioIndex = 0;
let primePromise: Promise<void> | null = null;

function initializeAudioPool() {
  if (audioPool.length > 0) return;

  for (let index = 0; index < 4; index += 1) {
    const audio = new Audio(questionCharacterSoundUrl);
    audio.preload = "auto";
    audio.volume = CHARACTER_SOUND_VOLUME;
    audioPool.push(audio);
  }
}

export default function useQuizCharacterSound() {
  onMounted(initializeAudioPool);

  function primeCharacterSound() {
    initializeAudioPool();
    if (primePromise) return;

    primePromise = Promise.all(
      audioPool.map(async (audio) => {
        audio.muted = true;
        audio.currentTime = 0;

        try {
          await audio.play();
          audio.pause();
          audio.currentTime = 0;
        } finally {
          audio.muted = false;
        }
      }),
    )
      .then(() => undefined)
      .catch(() => {
        primePromise = null;
      });
  }

  function playCharacterSound(characterIndex: number) {
    initializeAudioPool();

    const audio = audioPool[nextAudioIndex % audioPool.length];
    if (!audio) return;

    nextAudioIndex += 1;
    audio.playbackRate = playbackRates[characterIndex % playbackRates.length] ?? 1;
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }

  return { playCharacterSound, primeCharacterSound };
}
