<script setup>
defineProps({
  // TODO: declare a users prop with the Array type and mark it as required.
});

const emit = defineEmits([
  // TODO: declare the select event.
]);
</script>

<template>
  <!-- Please keep the data-testid attributes: the tests use them to validate your solution. -->
  <ul data-testid="user-list" class="user-list">
    <li v-for="user in users" :key="user.id">
      <button data-testid="user-item" class="user-item" type="button" @click="emit('select', user.id)">
        <span class="avatar">{{ user.name.charAt(0) }}</span>
        <span>
          <strong>{{ user.name }}</strong>
          <small>{{ user.role }}</small>
        </span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.user-list {
  display: grid;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.user-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  color: var(--foreground);
  font: inherit;
  text-align: left;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  cursor: pointer;
}

.avatar {
  display: grid;
  flex: 0 0 2.25rem;
  width: 2.25rem;
  height: 2.25rem;
  color: var(--primary-foreground);
  font-weight: 700;
  background: var(--primary);
  border-radius: 50%;
  place-items: center;
}

strong,
small {
  display: block;
}

small {
  margin-top: 0.125rem;
  color: var(--muted-foreground);
}
</style>
