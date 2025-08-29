<script lang="ts" setup>
import { ref } from "vue";

interface Tab {
  name: string;
  id: string;
}

const props = defineProps<{
  id: string;
  items: Tab[];
}>();

const activeTab = ref(props.items[0].id);

function openTab(tabiId: string) {
  activeTab.value = tabiId;
}
</script>

<template>
  <div class="w-full" :id="id">
    <!-- Tab Header -->
    <div class="flex justify-start items-center gap-3 border-b border-gray-300 dark:border-gray-700 overflow-x-auto">
      <button
        v-for="(item, i) in items"
        @click="openTab(item.id)"
        :data-id="item.id"
        :key="i"
        class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
        :class="[activeTab === item.id ? 'border-blue-500  text-blue-500' : ' border-transparent' ]">
          {{ $t(item.name) }}
      </button>
    </div>
    <!-- Tab Content -->
    <div>
      <div
        v-for="(item, i) in items"
        :key="i"
        :id="`tab-${item.id}`"
        v-show="activeTab === item.id">
          <slot :name="item.id"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
</style>