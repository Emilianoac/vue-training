<script lang="ts" setup>

const props = defineProps<{
  width?: string;
  height?: string;
}>()

</script>

<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="width ? width : 32"
    :height="height ? width : 32"
    viewBox="0 0 24 24">
      <path 
        fill="currentColor" 
        d="m.5 12l4.95-4.95L5.449 11H10v2H5.448v3.947zM14 13h4.55v3.95L23.5 12l-4.95-4.95V11H14z"
      />
  </svg>
</template>

<style lang="postcss"></style>