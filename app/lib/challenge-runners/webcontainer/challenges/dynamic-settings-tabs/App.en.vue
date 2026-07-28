<script setup>
import { ref } from "vue";
import ProfileTab from "./ProfileTab.vue";
import SecurityTab from "./SecurityTab.vue";

const currentTab = ref("profile");
const tabs = { profile: ProfileTab, security: SecurityTab };
</script>

<template>
  <!-- Please keep the data-testid attributes: the tests use them to validate your solution. -->
  <main class="settings">
    <h1>Settings</h1>
    <nav class="tabs" aria-label="Settings sections">
      <button
        data-testid="profile-tab"
        type="button"
        :class="{ active: currentTab === 'profile' }"
        :aria-pressed="currentTab === 'profile'"
        @click="currentTab = 'profile'"
      >
        Profile
      </button>
      <button
        data-testid="security-tab"
        type="button"
        :class="{ active: currentTab === 'security' }"
        :aria-pressed="currentTab === 'security'"
        @click="currentTab = 'security'"
      >
        Security
      </button>
    </nav>

    <section class="tab-content">
      <!-- TODO: render tabs[currentTab] with a dynamic component. -->
      <!-- TODO: use KeepAlive to preserve state when switching tabs. -->
    </section>
  </main>
</template>

<style scoped>
.settings {
  width: min(100% - 2rem, 36rem);
  margin: min(10vh, 4rem) auto;
  color: var(--card-foreground);
}
h1 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
}
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
button {
  padding: 0.55rem 0.9rem;
  color: var(--foreground);
  font: inherit;
  font-weight: 600;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}
button.active {
  color: var(--primary-foreground);
  background: var(--primary);
  border-color: var(--primary);
}
.tab-content {
  min-height: 12rem;
  padding: 1.25rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}
</style>
