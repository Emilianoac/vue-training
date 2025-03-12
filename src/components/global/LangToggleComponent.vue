<script lang="ts" setup>
import { onMounted, onUnmounted, ref, useTemplateRef} from "vue";
import { useI18n } from "vue-i18n";
import IconLang from "@/components/icons/IconLang.vue";

const { locale } = useI18n({ useScope: "global" });

const dropdownRef = useTemplateRef("lang-dropdown");
const isOpen = ref(false);
const languages = [
  { code: "en", name: "general.english"},
  { code: "es", name: "general.spanish"}
];

function changeLanguage(lang: string) {
  document.cookie = "locale=" + lang;
  locale.value = lang;
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <div class="relative" ref="lang-dropdown">
    <!-- Dropdown button -->
    <button 
      @click="isOpen = !isOpen"
      data-test="lang-toggle-button"
      class="bg-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-black dark:text-white  w-8 h-8 rounded-md flex items-center justify-center focus:ring-4  focus:ring-blue-300 dark:focus:ring-blue-800 focus:outline-none"
      type="button"> 
        <IconLang width="14" height="14"/>
    </button>

    <!-- Dropdown menu -->
    <div 
      data-test="lang-toggle-menu" 
      :class="isOpen ? 'absolute' : 'hidden'"
      class="z-10 top-12 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li v-for="(language) in languages" :key="language.code">
          <button 
            @click="changeLanguage(language.code)"   
            :data-test="`lang-${language.code}`"
            :class="locale === language.code ? 'bg-blue-200 hover:bg-blue-200 dark:bg-blue-600 hover:dark:bg-blue-600' : ''"         
            class="w-full text-start block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
             {{ $t(language.name) }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>


<style lang="postcss"></style>
