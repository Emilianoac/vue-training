<script lang="ts" setup>
import {ref} from "vue";
import FirefoxAlertComponent from "@/components/FirefoxAlertComponent.vue";
import IconExpand from "@/components/icons/IconExpand.vue";

const expandeEditor = ref(false);

defineProps<{  
  stackblitzUrl: string;
  objectives?: string[];
}>();

</script>

<template>
  <div class="flex items-center justify-end my-3">
    <button 
      data-test="toggle-editor"
      @click="expandeEditor = !expandeEditor" 
      :title="expandeEditor ? $t('challenge.play.collapse_editor') : $t('challenge.play.expand_editor')"
      class="bg-slate-300 dark:bg-gray-800 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-gray-700 hidden lg:block">
        <IconExpand width="20" height="20" />
      </button>
  </div>
  <div 
    data-test="challenge-playground"
    class="grid grid-cols-1 gap-6 mb-5"
    :class="[expandeEditor ? 'expand-editor' : 'collapse-editor']">

    <div v-if="!expandeEditor">
      <!-- Objectives -->
      <template v-if="objectives">
        <h2 class="font-bold text-gray-900 dark:text-white mb-2">{{$t("challenge.description.objectives")}}</h2>
        <ul class="mt-2 text-gray-900 dark:text-gray-300 p-0">
          <li 
            v-for="(item, i) in objectives" 
            :key="i" 
            class="mb-2 last-of-type:mb-0 text-gray-900 dark:text-gray-300 text-sm p-2 rounded-md bg-gray-200 dark:bg-gray-800 flex gap-1 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer">
              <input type="checkbox" class="mr-2" :id="item" :value="item" :name="item" :key="i" />
              <label :for="item" class="text-gray-900 dark:text-gray-300 text-sm cursor-pointer">
                {{ item }}
              </label>
          </li>
        </ul>
        <hr class="h-px my-6 bg-gray-300 border-0 dark:bg-gray-700"/>
      </template>

      <!-- Instructions -->
      <p>
        {{$t("challenge.play.instructions")}}
        <code class="bg-gray-200 dark:bg-gray-800 dark:text-gray-300 p-1 rounded-md">npm run test:unit</code>
      </p>
      <p class="my-4">{{$t("challenge.play.instructions_2")}}</p>

      <hr class="my-6 dark:border-gray-700"/>

      <!-- Info -->
        <div class="p-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
        {{$t("challenge.play.info")}}
      </div>

      <hr class="my-6 dark:border-gray-700"/>

      <!-- Firefox Alert -->
      <FirefoxAlertComponent />
    </div>

      <!-- Playground -->
      <iframe
        data-test="stackblitz-iframe"
        @load="$emit('iframe-loaded')"
        class="w-full h-[500px]"
        :src="stackblitzUrl"
        frameborder="0"
        allowfullscreen>
      </iframe>
  </div>
</template>

<style lang="postcss" scoped>

  .expand-editor {
    grid-template-columns: 1fr;
  }

  .collapse-editor {
    @apply grid-cols-1 lg:grid-cols-[0.3fr,1fr];
  }
</style>
