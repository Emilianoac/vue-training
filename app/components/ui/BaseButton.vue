<script setup lang="ts">

  interface Props {
    type?: "button" | "NuxtLink" | "a",
    to?: string,
    variant?: "primary" | "secondary",
  }

const props = withDefaults(defineProps<Props>(), {
  type: "NuxtLink",
  variant: "primary"
})

const componentType = computed(() => props.to ? defineNuxtLink({}) : props.type)
</script>

<template>
  <component
    :is="componentType"
    :to="to"
    class="app-button" 
    :class="[variant]"
  >
    <slot />
  </component>
</template>


<style lang="postcss" scoped>
  .app-button {
    @apply flex items-center justify-center font-medium px-6 py-2 rounded-md;
    @apply transition-all duration-300 cursor-pointer;

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
      @apply text-white bg-brand-main-700;

      &:not(:disabled):hover {
        @apply bg-brand-main-800;
      }
    }

    &.secondary {
      @apply bg-blue-100 text-blue-500;

      &:not(:disabled):hover {
        @apply bg-blue-200;
      }
    }
  }
</style>