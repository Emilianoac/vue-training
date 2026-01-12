<script setup lang="ts">
const NuxtLink = resolveComponent('NuxtLink');

interface Props {
  type?: "button" | "a" | "NuxtLink",
  to?: string | object | null,
  variant?: "primary" | "secondary",
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
  variant: "primary",
  to: null
})

const componentType = computed(() => {
  if (props.type === "NuxtLink") return NuxtLink
  return props.type
})
</script>

<template>
  <component
    :is="componentType"
    v-bind="$attrs"
    :to="type === 'NuxtLink' ? to : undefined"
    class="app-button" 
    :class="variant"
  >
    <slot />
  </component>
</template>


<style lang="postcss" scoped>
  .app-button {
    @apply flex items-center justify-center font-medium px-6 py-2 rounded-lg;
    @apply transition-all duration-300 cursor-pointer;
    @apply border-b-4;

    &:disabled {
      @apply cursor-not-allowed opacity-40;
    }

    &:focus-visible { 
      @apply ring-2 ;
    }

    &:active:not(:disabled) {
      @apply scale-95;
    }

    &.primary {
      @apply text-white bg-brand-main-700 border-brand-main-900;

      &:not(:disabled):hover {
        @apply bg-brand-main-800;
      }

      &:not(:disabled):active {
        @apply border-transparent;
      }
    }

    &.secondary {
      @apply text-blue-900 bg-blue-100 dark:bg-blue-200 dark:text-blue-950 border-slate-500;

      &:not(:disabled):hover {
        @apply bg-blue-100;
      }

      &:not(:disabled):active {
        @apply border-transparent;
      }
    }
  }
</style>