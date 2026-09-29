import quizAmbientSongUrl from "@/assets/audio/quiz/quiz-ambient-song.mp3?url";

export type QuizStage = "welcome" | "loading" | "ongoing" | "results";

type AmbientProfile = "welcome" | "loading" | "quiz" | "results";

const WELCOME_VOLUME = 0.08;
const QUIZ_VOLUME = 0.04;
const RESULTS_VOLUME = 0.05;
const OPEN_HIGH_PASS_FREQUENCY = 20;
const OPEN_LOW_PASS_FREQUENCY = 18000;
const RESULTS_HIGH_PASS_FREQUENCY = 280;
const RESULTS_LOW_PASS_FREQUENCY = 3200;
const WELCOME_FADE_IN_SECONDS = 0.3;
const WELCOME_FADE_OUT_MS = 180;
const QUIZ_FADE_IN_SECONDS = 0.9;
const RESULTS_TRANSITION_SECONDS = 0.6;

export default function useQuizAmbientMusic(stage: Readonly<Ref<QuizStage>>) {
  let audio: HTMLAudioElement | null = null;
  let audioContext: AudioContext | null = null;
  let sourceNode: MediaElementAudioSourceNode | null = null;
  let highPassFilter: BiquadFilterNode | null = null;
  let lowPassFilter: BiquadFilterNode | null = null;
  let gainNode: GainNode | null = null;
  let currentProfile: AmbientProfile | null = null;
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;
  let hasStarted = false;

  function createAudioGraph() {
    if (audioContext) return;

    audio = new Audio(quizAmbientSongUrl);
    audio.loop = true;
    audio.preload = "auto";

    audioContext = new AudioContext();
    sourceNode = audioContext.createMediaElementSource(audio);
    highPassFilter = audioContext.createBiquadFilter();
    lowPassFilter = audioContext.createBiquadFilter();
    gainNode = audioContext.createGain();

    highPassFilter.type = "highpass";
    highPassFilter.Q.value = 0.7;
    highPassFilter.frequency.value = OPEN_HIGH_PASS_FREQUENCY;
    lowPassFilter.type = "lowpass";
    lowPassFilter.Q.value = 0.7;
    lowPassFilter.frequency.value = OPEN_LOW_PASS_FREQUENCY;
    gainNode.gain.value = 0;

    sourceNode.connect(highPassFilter);
    highPassFilter.connect(lowPassFilter);
    lowPassFilter.connect(gainNode);
    gainNode.connect(audioContext.destination);
  }

  function configureCleanSound() {
    if (!audioContext || !highPassFilter || !lowPassFilter || !gainNode) return;

    const now = audioContext.currentTime;
    highPassFilter.frequency.cancelScheduledValues(now);
    lowPassFilter.frequency.cancelScheduledValues(now);
    highPassFilter.frequency.setValueAtTime(OPEN_HIGH_PASS_FREQUENCY, now);
    lowPassFilter.frequency.setValueAtTime(OPEN_LOW_PASS_FREQUENCY, now);
    gainNode.gain.setValueAtTime(0, now);
  }

  function rampParameter(parameter: AudioParam, target: number, duration: number) {
    if (!audioContext) return;

    const now = audioContext.currentTime;
    parameter.cancelScheduledValues(now);
    parameter.setValueAtTime(parameter.value, now);
    parameter.linearRampToValueAtTime(target, now + duration);
  }

  function rampVolume(target: number, duration: number) {
    if (!audioContext || !gainNode) return;

    const now = audioContext.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(target, now + duration);
  }

  function clearTransitionTimer() {
    if (transitionTimer === undefined) return;

    clearTimeout(transitionTimer);
    transitionTimer = undefined;
  }

  function resetTrack() {
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }

  function playTrack() {
    if (!audio) return;
    void audio.play().catch(() => undefined);
  }

  function startWelcomeTrack() {
    clearTransitionTimer();
    resetTrack();
    configureCleanSound();
    playTrack();
    rampVolume(WELCOME_VOLUME, WELCOME_FADE_IN_SECONDS);
  }

  function startQuizTrack() {
    resetTrack();
    configureCleanSound();
    playTrack();
    rampVolume(QUIZ_VOLUME, QUIZ_FADE_IN_SECONDS);
  }

  function applyResultsSound() {
    if (!highPassFilter || !lowPassFilter) return;

    rampParameter(
      highPassFilter.frequency,
      RESULTS_HIGH_PASS_FREQUENCY,
      RESULTS_TRANSITION_SECONDS,
    );
    rampParameter(
      lowPassFilter.frequency,
      RESULTS_LOW_PASS_FREQUENCY,
      RESULTS_TRANSITION_SECONDS,
    );
    rampVolume(RESULTS_VOLUME, RESULTS_TRANSITION_SECONDS);
  }

  function applyStage(nextStage: QuizStage) {
    const nextProfile = getProfile(nextStage);
    if (nextProfile === currentProfile) return;

    const previousProfile = currentProfile;
    currentProfile = nextProfile;
    clearTransitionTimer();

    if (nextProfile === "welcome") {
      startWelcomeTrack();
      return;
    }

    if (nextProfile === "loading") {
      rampVolume(0, WELCOME_FADE_OUT_MS / 1000);
      transitionTimer = setTimeout(() => {
        if (currentProfile !== "loading") return;
        resetTrack();
      }, WELCOME_FADE_OUT_MS);
      return;
    }

    if (nextProfile === "quiz") {
      if (previousProfile !== "welcome") {
        startQuizTrack();
        return;
      }

      rampVolume(0, WELCOME_FADE_OUT_MS / 1000);
      transitionTimer = setTimeout(() => {
        if (currentProfile !== "quiz") return;
        startQuizTrack();
      }, WELCOME_FADE_OUT_MS);
      return;
    }

    applyResultsSound();
  }

  function getProfile(nextStage: QuizStage): AmbientProfile {
    if (nextStage === "welcome") return "welcome";
    if (nextStage === "loading") return "loading";
    if (nextStage === "results") return "results";
    return "quiz";
  }

  function removeStartListeners() {
    document.removeEventListener("pointerdown", handleUserInteraction, true);
    document.removeEventListener("keydown", handleUserInteraction, true);
  }

  async function startAmbientMusic() {
    try {
      createAudioGraph();
      if (!audioContext || !audio) return;

      await audioContext.resume();
      await audio.play();
      hasStarted = true;
      removeStartListeners();
      applyStage(stage.value);
    } catch {
      // Keep the listeners so a later user interaction can retry playback.
    }
  }

  function handleUserInteraction() {
    void startAmbientMusic();
  }

  watch(stage, (nextStage) => {
    if (!hasStarted) return;
    applyStage(nextStage);
  });

  onMounted(() => {
    document.addEventListener("pointerdown", handleUserInteraction, true);
    document.addEventListener("keydown", handleUserInteraction, true);
    void startAmbientMusic();
  });

  onBeforeUnmount(() => {
    clearTransitionTimer();
    removeStartListeners();
    resetTrack();
    sourceNode?.disconnect();
    highPassFilter?.disconnect();
    lowPassFilter?.disconnect();
    gainNode?.disconnect();
    void audioContext?.close();
  });
}
