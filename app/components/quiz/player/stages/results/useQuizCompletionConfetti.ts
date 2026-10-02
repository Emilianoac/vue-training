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
const CONFETTI_CANVAS_Z_INDEX = "53";
const INITIAL_BURST_DELAY_MS = 80;
const CONFETTI_CADENCE_MS = 650;
const PASSED_CONFETTI_COLORS = ["#60a5fa", "#ef4444", "#facc15", "#a78bfa", "#34d399"];
const PERFECT_CONFETTI_COLORS = ["#38bdf8", "#fb7185", "#fde047", "#c084fc", "#f8fafc"];

export default function useQuizCompletionConfetti(
  open: MaybeRefOrGetter<boolean>,
  outcome: MaybeRefOrGetter<QuizOutcome>,
  stage: MaybeRefOrGetter<HTMLElement | null>,
) {
  let cadenceTimer: number | undefined;
  let initialBurstTimer: number | undefined;

  function getColors() {
    return toValue(outcome) === "perfect"
      ? PERFECT_CONFETTI_COLORS
      : PASSED_CONFETTI_COLORS;
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

  function getStageGeometry() {
    const stageElement = toValue(stage);
    if (!stageElement) return null;

    const stageRect = stageElement.getBoundingClientRect();

    return {
      stageRect,
      origin: {
        x: stageRect.left + stageRect.width / 2,
        y: stageRect.top + 24,
      },
    };
  }

  function placeConfettiInHostColumn() {
    const canvas = findConfettiCanvas();
    const geometry = getStageGeometry();
    if (!canvas || !geometry) return;

    const { stageRect } = geometry;

    canvas.dataset.quizCompletionConfetti = "";
    canvas.style.zIndex = CONFETTI_CANVAS_Z_INDEX;
    canvas.style.opacity = "1";
    canvas.style.clipPath = `inset(${Math.max(0, stageRect.top)}px ${Math.max(0, window.innerWidth - stageRect.right)}px ${Math.max(0, window.innerHeight - stageRect.bottom)}px ${Math.max(0, stageRect.left)}px)`;
  }

  function launch(options: ConfettiOptions) {
    (window as ConfettiWindow).confetti?.(options);
    placeConfettiInHostColumn();
  }

  function launchInitialBurst() {
    const geometry = getStageGeometry();
    if (!geometry) return;

    launch({
      color: getColors(),
      count: 64,
      fade: true,
      position: geometry.origin,
      size: 1.8,
      velocity: 155,
    });
  }

  function launchCadenceBurst() {
    const geometry = getStageGeometry();
    if (!geometry) return;

    launch({
      color: getColors(),
      count: 10,
      fade: true,
      position: {
        x: geometry.origin.x + (Math.random() - 0.5) * 36,
        y: geometry.origin.y,
      },
      size: 1.25,
      velocity: 80,
    });
  }

  function clearScheduledBursts() {
    if (initialBurstTimer !== undefined) {
      window.clearTimeout(initialBurstTimer);
      initialBurstTimer = undefined;
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

    initialBurstTimer = window.setTimeout(() => {
      initialBurstTimer = undefined;
      launchInitialBurst();
    }, INITIAL_BURST_DELAY_MS);
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
