<script lang="ts" setup>
import { ref } from "vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import IconLang from "@/components/assets/icons/IconLang.vue";

const { locale, setLocale, locales, t } = useI18n();
const selectedLanguage = ref(locale.value);

watch(selectedLanguage, (newLang) => {
  setLocale(newLang);
});
</script>

<template>
   <DropdownMenu>
    <DropdownMenuTrigger :as-child="true">
      <Button variant="outline" size="icon-sm"> 
        <IconLang width="14" height="14"/>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuGroup>
        <DropdownMenuLabel class="text-xs">Select Language</DropdownMenuLabel>
        <DropdownMenuRadioGroup v-model="selectedLanguage">
          <DropdownMenuRadioItem 
            v-for="lang in locales"
            :value="lang.code">
            {{ t(lang.code) }}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style lang="postcss" scoped>
  
</style>
