<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const users = [
  { id: "ada", name: "Ada Lovelace", role: "Pionera de la programación" },
  { id: "grace", name: "Grace Hopper", role: "Creadora de compiladores" },
  { id: "margaret", name: "Margaret Hamilton", role: "Ingeniera de software" },
];

const route = useRoute();

const user = computed(() =>
  users.find((candidate) => candidate.id === String(route.params.id)),
);
</script>

<template>
  <!-- Por favor conserva los atributos data-testid: los tests los usan para validar tu solución. -->
  <article v-if="user" class="profile-card">
    <span data-testid="user-id" class="user-id">Perfil / {{ user.id }}</span>
    <h2 data-testid="user-name">{{ user.name }}</h2>
    <p data-testid="user-role">{{ user.role }}</p>
  </article>

  <section v-else data-testid="not-found" class="not-found">
    <strong>Perfil no encontrado</strong>
    <p>No existe un usuario para el parámetro actual.</p>
  </section>
</template>
