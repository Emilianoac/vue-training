<script setup>
import { computed, ref } from "vue";
import UserList from "./UserList.vue";

const query = ref("");
const selectedUser = ref(null);
const users = [
  { id: 1, name: "Ada Lovelace", role: "Programmer" },
  { id: 2, name: "Grace Hopper", role: "Computer scientist" },
  { id: 3, name: "Tim Berners-Lee", role: "Web creator" },
];

const filteredUsers = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();
  return users.filter((user) => user.name.toLowerCase().includes(normalizedQuery));
});

function selectUser(userId) {
  selectedUser.value = users.find((user) => user.id === userId) ?? null;
}
</script>

<template>
  <!-- Please keep the data-testid attributes: the tests use them to validate your solution. -->
  <main class="directory-card">
    <div>
      <span class="eyebrow">Team</span>
      <h1>User directory</h1>
    </div>

    <label class="search-field">
      <span>Search by name</span>
      <input v-model="query" data-testid="search-input" type="search" placeholder="E.g. Grace" />
    </label>

    <!-- TODO: pass filteredUsers to UserList and listen to its select event. -->
    <UserList />

    <p data-testid="selected-user" class="selection">
      {{ selectedUser ? `You selected ${selectedUser.name}` : "Select a person" }}
    </p>
  </main>
</template>

<style scoped>
.directory-card {
  display: grid;
  gap: 1.25rem;
  width: min(100% - 2rem, 38rem);
  margin: min(10vh, 4rem) auto;
  padding: 1.5rem;
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

.eyebrow {
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

h1 {
  margin: 0.25rem 0 0;
  font-size: 1.5rem;
}

.search-field {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
}

input {
  padding: 0.65rem 0.75rem;
  color: var(--foreground);
  font: inherit;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

.selection {
  margin: 0;
  color: var(--muted-foreground);
}
</style>
