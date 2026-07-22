<script setup>
import { ref } from "vue";

const isSessionActive = ref(false);
const secondsOnline = ref(0);
const viewportWidth = ref(0);

let intervalId;

function updateViewportWidth() {
  viewportWidth.value = window.innerWidth;
}

function startSession() {
  // TODO: change isSessionActive to true.
  // TODO: update the initial window width.
  // TODO: listen to the resize event to keep viewportWidth updated.
  // TODO: start an interval that increases secondsOnline every second.
}

function stopSession() {
  // TODO: clear the interval.
  // TODO: remove the resize listener.
}
</script>

<template>
  <!-- Please do not remove the data-testid attributes: the challenge tests use them to validate your solution. -->
  <section class="session-monitor">
    <span class="eyebrow">Session monitor</span>

    <h2>Component status</h2>

    <dl class="metrics">
      <div class="metric">
        <dt>Status</dt>
        <dd data-testid="status" :data-active="isSessionActive">
          {{ isSessionActive ? "Session active" : "Session inactive" }}
        </dd>
      </div>

      <div class="metric">
        <dt>Active time</dt>
        <dd data-testid="seconds-online">{{ secondsOnline }}s</dd>
      </div>

      <div class="metric">
        <dt>Viewport width</dt>
        <dd data-testid="viewport-width">{{ viewportWidth }}px</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
/* Please do not edit these styles for now: they only shape the challenge preview. */
.session-monitor {
  display: grid;
  gap: 1rem;
  max-width: 30rem;
  margin: 2.5rem auto 0;
  padding: 1.5rem;
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}

.eyebrow {
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: var(--foreground);
  font-size: 1.35rem;
}

.metrics {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}

.metric {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

dt {
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

dd {
  margin: 0;
  color: var(--foreground);
  font-weight: 700;
}
</style>
