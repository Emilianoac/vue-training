<script setup>
import { ref } from "vue";

const twoFactor = ref(false);
const showRecoveryCodes = ref(false);
</script>

<template>
  <!-- Please keep the data-testid attributes: the tests use them to validate your solution. -->
  <div class="security-settings">
    <h2>Security</h2>

    <label>
      <input v-model="twoFactor" data-testid="two-factor" type="checkbox" />
      Two-factor authentication
    </label>

    <button data-testid="toggle-recovery" type="button" @click="showRecoveryCodes = !showRecoveryCodes">
      Show recovery codes
    </button>

    <!-- TODO: use v-show to display this panel only when showRecoveryCodes is true. -->
    <div data-testid="recovery-codes" class="recovery-codes">
      <code>VUE-2026</code>
      <code>KEEP-ALIVE</code>
    </div>
  </div>
</template>

<style scoped>
.security-settings { display: grid; gap: 1rem; }
h2 { margin: 0; }
label { display: flex; gap: 0.5rem; }
button { width: fit-content; padding: 0.5rem 0.75rem; color: var(--foreground); font: inherit; background: var(--background); border: 1px solid var(--border); border-radius: 0.375rem; }
.recovery-codes { display: flex; gap: 0.5rem; padding: 0.75rem; background: var(--background); border: 1px solid var(--border); border-radius: 0.375rem; }
</style>
