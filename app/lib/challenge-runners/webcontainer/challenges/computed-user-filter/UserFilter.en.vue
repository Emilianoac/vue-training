<script setup>
import { ref } from "vue";

const search = ref("");
const users = ref([
  "Ada Lovelace",
  "Evan You",
  "Tim Berners-Lee",
  "Terry Davis",
]);

// TODO: import computed and turn filteredUsers into a computed property.
// It should return only the users whose name includes search.value.
const filteredUsers = users;

function clearSearch() {
  search.value = "";
}
</script>

<template>
  <!-- Please do not remove data-testid attributes: the challenge tests use them to validate your solution. -->
  <section class="user-filter">
    <label class="field-label" for="search">Search users</label>
    <input
      id="search"
      v-model="search"
      data-testid="search-input"
      class="field"
      placeholder="Search by name..."
    />

    <p data-testid="result-count" class="summary">
      Matching users: {{ filteredUsers.length }}
    </p>

    <ul class="user-list">
      <li
        v-for="user in filteredUsers"
        :key="user"
        data-testid="user-item"
        class="user-item"
      >
        {{ user }}
      </li>
    </ul>

    <button data-testid="clear-button" class="btn" @click="clearSearch">
      Clear search
    </button>
  </section>
</template>

<style scoped>
/* Please do not edit these styles for now: they only shape the challenge preview. */
.user-filter {
  max-width: 28rem;
  margin: 2.5rem auto 0;
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

.summary {
  margin: 1rem 0;
  color: var(--muted-foreground);
  font-size: 0.9rem;
}

.user-list {
  display: grid;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.user-item {
  padding: 0.75rem;
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
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
