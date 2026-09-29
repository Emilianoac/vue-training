import type { MaybeRefOrGetter } from "vue";

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

export default function useQuizPassedCelebration(
  percentage: MaybeRefOrGetter<number>,
  requiredPercentage: MaybeRefOrGetter<number | undefined>,
) {
  function celebratePassedQuiz() {
    const requiredScore = toValue(requiredPercentage);
    const hasPassed = requiredScore !== undefined && toValue(percentage) >= requiredScore;

    if (!hasPassed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    (window as ConfettiWindow).confetti?.({
      color: [145, 165, 75, 45],
      count: 110,
      fade: true,
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.28,
      },
      size: 1,
      velocity: 170,
    });
  }

  onMounted(celebratePassedQuiz);
}
