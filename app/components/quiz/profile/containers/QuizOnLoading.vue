<script lang="ts" setup>
  import { loadingMessages } from "@/constants/loading-screen-tips";
  import Vuecito from "@/components/assets/illustrations/Vuecito.vue";

  const { locale } =  useI18n();

  const randomMessage = useState('loading-tip', () => {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  });
</script>

<template>
  <div 
    v-if="randomMessage"
    class="fixed flex justify-center items-center w-full bg-slate-50 dark:bg-slate-900 top-0 left-0 bottom-0 z-999">
    <div class="flex flex-col justify-center items-center p-2">
      <div class="flex flex-col justify-center">
        <div class="loading-tips ring-8 bg-slate-200 ring-slate-300 text-slate-800 dark:bg-slate-800 dark:ring-slate-700 dark:text-slate-400">
          <p class="opacity-30 text-xs font-semibold select-none">C:\Users\vue-training></p>

          <p class="mt-2 font-semibold">{{ randomMessage[locale] }}</p>
        </div>
        <Vuecito 
          class="max-w-50 mx-auto h-max z-999"
          mood="surprised"
          :show-code-editor="false"
          tip-id="tip"
        />
      </div>

      <div class="flex items-center gap-2 mt-6">
        <span class="block font-bold">{{ $t("general.loading") }} </span> 
        <div class="loading-dots">
          <div 
            v-for="value in 3"
            :key="value"
            class="bg-slate-900 dark:bg-slate-50 "
            :class="`loading-dot-${value + 1}`">
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.loading-tips {
  max-width: 320px;
  position: relative;
  bottom: -50px;
  padding: 1em 1em 2em 1em;
  border-radius: 8px;
  background-clip: padding-box;
}

.loading-dots {
  margin: 0 auto;
  width: max-content;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 0.2em;

  > div {
    width: 4px;
    height: 4px;
    border-radius: 100%;
    display: inline-block;
    animation: loading-dots 2s infinite linear both;
    padding: 0.3em;
  }
  .loading-dot-1 {
    animation-delay: -0.32s;
  }
  .loading-dot-2 {
    animation-delay: -0.16s;
  }
}

@keyframes loading-dots {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(6px);
  }

  100% {
    transform: translateY(0px);
  }
}
</style>
