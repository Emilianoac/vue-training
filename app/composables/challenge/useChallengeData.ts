import { challengeService } from "@/services/api/challenge/challengeService";
import type { Challenge } from "@/schemas/challenge.schema";

export default function useChallengeData() {
  const { locale } = useI18n();
  
  const challenge = ref<Challenge>();
  const challenges = ref<Challenge[]>([]);
  const isLoading = ref(false);
  const error = ref<{ status: boolean; message: string }>({ 
    status: false, 
    message: "" 
  });

  async function getChallenge(slug: string) {
    await loadAndSet(() => challengeService.fetchChallenge(slug, locale.value), challenge)
  }

  async function getChallenges() {
    await loadAndSet(() => challengeService.fetchChallenges(locale.value), challenges)
  }

  async function loadAndSet<T>(fetchFn: () => Promise<T>, targetRef: Ref<T>) {
    isLoading.value = true;
    error.value.status = false;
    error.value.message = "";

    try {
      const data = await fetchFn();
      targetRef.value = data;
    } catch (err) {
      error.value.status = true;
      error.value.message = err instanceof Error ? err.message : "Unkown error"
    } finally {
      isLoading.value = false;
    }
  }

  return {
    challenge,
    challenges,
    isLoading,
    error,

    getChallenge,
    getChallenges
  };
}