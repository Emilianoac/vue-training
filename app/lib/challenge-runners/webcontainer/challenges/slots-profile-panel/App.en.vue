<script setup>
import BasePanel from "./BasePanel.vue";
</script>

<template>
  <!-- Please keep BasePanel and the data-testid attributes: the tests use them to validate your solution. -->
  <main class="workspace">
    <p class="eyebrow">Account settings</p>

    <BasePanel>
      <!-- TODO: place this title inside the header slot. -->
      <h1 data-testid="profile-title">Ana's profile</h1>

      <p data-testid="profile-description" class="description">
        Review the information before saving your changes.
      </p>

      <!-- TODO: place these buttons inside the actions slot. -->
      <div class="button-group">
        <button data-testid="cancel-button" class="btn" type="button">Cancel</button>
        <button data-testid="save-button" class="btn btn-primary" type="button">Save</button>
      </div>
    </BasePanel>
  </main>
</template>

<style scoped>
/* Please do not edit these styles for now: they only shape the challenge preview. */
.workspace {
  width: min(100% - 2rem, 38rem);
  margin: min(10vh, 4rem) auto;
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.description {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

:deep(h1),
:deep(h2) {
  margin: 0;
  color: var(--foreground);
  font-size: 1.25rem;
}

:deep(.btn) {
  padding: 0.55rem 0.9rem;
  color: var(--foreground);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

:deep(.btn-primary) {
  color: var(--primary-foreground);
  background: var(--primary);
  border-color: var(--primary);
}
</style>
