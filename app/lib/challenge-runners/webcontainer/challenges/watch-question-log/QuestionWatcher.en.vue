<script setup>
import { ref } from "vue";

const question = ref("");
const answer = ref("Write a question that ends with ?");
const changeLog = ref([]);

function clearQuestion() {
  question.value = "";
  answer.value = "Write a question that ends with ?";
  changeLog.value = [];
}

// TODO: import watch from vue and watch question.
// When question changes:
// - if it is empty, update answer with "Write a question that ends with ?"
// - if it does not end with ?, update answer with "Questions should end with ?"
// - if it ends with ?, update answer with "Good question. Vue reacted to the change."
// - if it is not empty, add `Change detected: ${newQuestion}` to changeLog.
</script>

<template>
  <!-- Please do not remove the data-testid attributes: the challenge tests use them to validate your solution. -->
  <section class="question-watcher">
    <label class="field-label" for="question">Question for Vue</label>
    <input
      id="question"
      v-model="question"
      data-testid="question-input"
      class="field"
      placeholder="Can Vue react?"
    />

    <p data-testid="answer" class="answer">{{ answer }}</p>

    <div class="log-panel">
      <p class="log-title">Detected changes</p>
      <p v-if="changeLog.length === 0" class="empty-log">
        No changes have been recorded yet.
      </p>
      <ul v-else class="change-log">
        <li
          v-for="entry in changeLog"
          :key="entry"
          data-testid="log-entry"
          class="log-entry"
        >
          {{ entry }}
        </li>
      </ul>
    </div>

    <button data-testid="clear-button" class="btn" @click="clearQuestion">
      Clear
    </button>
  </section>
</template>

<style scoped>
/* Please do not edit these styles for now: they only shape the challenge preview. */
.question-watcher {
  max-width: 32rem;
  margin: min(12vh, 5rem) auto;
  padding: 1.5rem;
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}

.field-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--foreground);
  font-size: 0.875rem;
  font-weight: 600;
}

.field {
  width: 100%;
  padding: 0.625rem 0.75rem;
  color: var(--foreground);
  font: inherit;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

.answer {
  margin: 1rem 0;
  color: var(--foreground);
  font-weight: 600;
}

.log-panel {
  padding: 1rem;
  margin-top: 1rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

.log-title {
  margin: 0 0 0.5rem;
  color: var(--foreground);
  font-size: 0.875rem;
  font-weight: 600;
}

.empty-log {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

.change-log {
  display: grid;
  gap: 0.375rem;
  max-height: 8rem;
  padding: 0;
  margin: 0;
  overflow: auto;
  list-style: none;
}

.log-entry {
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

.btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  color: var(--primary-foreground);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 0.375rem;
}

.btn:hover {
  opacity: 0.9;
}
</style>
