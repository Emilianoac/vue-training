<script setup>
import BasePanel from "./BasePanel.vue";
</script>

<template>
  <!-- Por favor conserva BasePanel y los atributos data-testid: los tests los usan para validar tu solución. -->
  <main class="workspace">
    <p class="eyebrow">Configuración de cuenta</p>

    <BasePanel>
      <template #header>
        <h1 data-testid="profile-title">Perfil de Ana</h1>
      </template>

      <p data-testid="profile-description" class="description">
        Revisa la información antes de guardar los cambios.
      </p>

      <template #actions>
        <div class="button-group">
          <button data-testid="cancel-button" class="btn" type="button">Cancelar</button>
          <button data-testid="save-button" class="btn btn-primary" type="button">Guardar</button>
        </div>
      </template>
    </BasePanel>
  </main>
</template>

<style scoped>
/* Por favor no edites estos estilos por ahora: solo dan forma al preview del challenge. */
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
