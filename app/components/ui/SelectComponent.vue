<script lang="ts" setup>

const selectedItem = defineModel();

defineProps<{
  items: {label: string, id:string}[];
  label: string;
}>();
</script>

<template>
  <div class="block md:flex items-center gap-2 mb-4 md:mb-0 last:mb-0">
    <label for="category" class="text-sm mb-2 md:mb-0 text-gray-700 dark:text-gray-300 font-semibold flex items-center">
      <span>{{ label }}</span> <span class="hidden md:inline">:</span>
    </label>
    <select 
      class="w-full py-2 px-5 border border-gray-300 dark:border-gray-800 rounded-md dark:bg-gray-900 text-sm" 
      v-model="selectedItem">
        <option v-for="category in items" :key="category.id" :value="category.id">
          {{ category.label }}
        </option>
    </select>
  </div>
</template>

<style lang="postcss" scoped>
  
</style>
