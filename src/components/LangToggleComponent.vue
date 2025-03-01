<script lang="ts" setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import IconLang from "@/components/icons/IconLang.vue";

const { locale } = useI18n({ useScope: "global" });

const isOpen = ref(false);
const languages = [
  { code: "en", name: "general.english"},
  { code: "es", name: "general.spanish"}
];

function changeLanguage(lang: string) {
  document.cookie = "locale=" + lang;
  locale.value = lang;
}
</script>

<template>
  <div class="relative">
    <!-- Dropdown button -->
    <button 
      @click="isOpen = !isOpen"
      id="dropdownDefaultButton" data-dropdown-toggle="dropdown"
      class="bg-gray-300 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-black dark:text-white  w-8 h-8 rounded-full flex items-center justify-center focus:ring-4  focus:ring-blue-300 dark:focus:ring-blue-800 focus:outline-none"
      type="button"> 
        <IconLang width="14" height="14"/>
    </button>

    <!-- Dropdown menu -->
    <div 
      id="dropdown" 
      :class="isOpen ? 'absolute' : 'hidden'"
      class="z-10 top-12 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li v-for="(language) in languages" :key="language.code">
          <button 
            @click="changeLanguage(language.code)"            
            class="w-full text-start block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
            {{ $t(language.name) }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>


<style lang="postcss"></style>
