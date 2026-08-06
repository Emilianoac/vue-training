<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const users = [
  { id: "ada", name: "Ada Lovelace", role: "Programming pioneer" },
  { id: "grace", name: "Grace Hopper", role: "Compiler creator" },
  { id: "margaret", name: "Margaret Hamilton", role: "Software engineer" },
];

const route = useRoute();

const user = computed(() =>
  users.find((candidate) => candidate.id === String(route.params.id)),
);
</script>

<template>
  <!-- Please keep the data-testid attributes: the tests use them to validate your solution. -->
  <article v-if="user" class="profile-card">
    <span data-testid="user-id" class="user-id">Profile / {{ user.id }}</span>
    <h2 data-testid="user-name">{{ user.name }}</h2>
    <p data-testid="user-role">{{ user.role }}</p>
  </article>

  <section v-else data-testid="not-found" class="not-found">
    <strong>Profile not found</strong>
    <p>There is no user for the current parameter.</p>
  </section>
</template>
