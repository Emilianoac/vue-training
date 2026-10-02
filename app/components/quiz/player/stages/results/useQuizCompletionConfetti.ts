import type { MaybeRefOrGetter } from "vue";
import type { QuizOutcome } from "@/domain/quiz/getQuizOutcome";

type ConfettiOptions = {
  color?: Array<number | string>;
  count?: number;
  fade?: boolean;
  position?: { x: number; y: number };
  size?: number;
  velocity?: number;
};

type ConfettiWindow = Window & {
  confetti?: (options?: ConfettiOptions) => void;
};

const CONFETTI_CANVAS_SELECTOR = "canvas[data-quiz-completion-confetti]";
const CONFETTI_CANVAS_Z_INDEX = "51";
const INITIAL_BURST_DELAY_MS = 140;
const CONFETTI_CADENCE_MS = 900;

export default function useQuizCompletionConfetti(
  open: MaybeRefOrGetter<boolean>,
  outcome: MaybeRefOrGetter<QuizOutcome>,
) {
  let cadenceTimer: ReturnType<typeof setTimeout> | undefined;
  let secondaryBurstTimer: ReturnType<typeof setTimeout> | undefined;

  function getColors() {
    return toValue(outcome) === "perfect" ? [48, 62, 86, 145] : [82, 132, 148, 165];
  }

  function canCelebrate() {
    return (
      toValue(outcome) !== "failed" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function findConfettiCanvas() {
    const existingCanvas = document.querySelector<HTMLCanvasElement>(CONFETTI_CANVAS_SELECTOR);
    if (existingCanvas) return existingCanvas;

    const canvases = Array.from(document.body.children).filter(
      (element): element is HTMLCanvasElement =>
        element instanceof HTMLCanvasElement &&
        element.style.position === "fixed" &&
        element.style.pointerEvents === "none",
    );

    return canvases.at(-1);
  }

  function placeConfettiBehindDialog() {
    const canvas = findConfettiCanvas();
    if (!canvas) return;

    canvas.dataset.quizCompletionConfetti = "";
    canvas.style.zIndex = CONFETTI_CANVAS_Z_INDEX;
    canvas.style.opacity = "1";
  }

  function launch(options: ConfettiOptions) {
    (window as ConfettiWindow).confetti?.(options);
    placeConfettiBehindDialog();
  }

  function launchInitialBurst() {
    const colors = getColors();

    launch({
      color: colors,
      count: 170,
      fade: true,
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.42,
      },
      size: 1.2,
      velocity: 220,
    });

    secondaryBurstTimer = window.setTimeout(() => {
      launch({
        color: colors,
        count: 90,
        fade: true,
        position: {
          x: window.innerWidth / 2,
          y: window.innerHeight * 0.35,
        },
        size: 0.95,
        velocity: 160,
      });
    }, INITIAL_BURST_DELAY_MS);
  }

  function launchCadenceBurst() {
    launch({
      color: getColors(),
      count: 16,
      fade: true,
      position: {
        x: window.innerWidth * (0.15 + Math.random() * 0.7),
        y: window.innerHeight * 0.18,
      },
      size: 0.75,
      velocity: 75,
    });
  }

  function clearScheduledBursts() {
    if (secondaryBurstTimer !== undefined) {
      window.clearTimeout(secondaryBurstTimer);
      secondaryBurstTimer = undefined;
    }

    if (cadenceTimer !== undefined) {
      window.clearTimeout(cadenceTimer);
      cadenceTimer = undefined;
    }
  }

  function scheduleCadenceBurst() {
    if (cadenceTimer !== undefined || document.hidden || !toValue(open)) return;

    cadenceTimer = window.setTimeout(() => {
      cadenceTimer = undefined;

      if (document.hidden || !toValue(open)) return;

      launchCadenceBurst();
      scheduleCadenceBurst();
    }, CONFETTI_CADENCE_MS);
  }

  function stop() {
    if (import.meta.server) return;

    clearScheduledBursts();

    const canvas = document.querySelector<HTMLCanvasElement>(CONFETTI_CANVAS_SELECTOR);
    if (canvas) canvas.style.opacity = "0";
  }

  function start() {
    if (import.meta.server) return;

    stop();

    if (!canCelebrate()) return;

    launchInitialBurst();
    scheduleCadenceBurst();
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      clearScheduledBursts();
      return;
    }

    if (toValue(open) && canCelebrate()) {
      scheduleCadenceBurst();
    }
  }

  watch(
    () => [toValue(open), toValue(outcome)] as const,
    ([isOpen]) => {
      if (isOpen) {
        start();
        return;
      }

      stop();
    },
    { flush: "post" },
  );

  onMounted(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onScopeDispose(() => {
    if (import.meta.client) {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
    stop();
  });
}
