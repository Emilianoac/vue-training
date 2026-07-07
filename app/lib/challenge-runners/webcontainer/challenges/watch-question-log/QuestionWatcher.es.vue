<script setup>
import { ref } from "vue";

const question = ref("");
const answer = ref("Escribe una pregunta que termine en ?");
const changeLog = ref([]);

function clearQuestion() {
  question.value = "";
  answer.value = "Escribe una pregunta que termine en ?";
  changeLog.value = [];
}

// TODO: importa watch desde vue y observa question.
// Cuando question cambie:
// - si está vacía, actualiza answer con "Escribe una pregunta que termine en ?"
// - si no termina en ?, actualiza answer con "Las preguntas deben terminar con ?"
// - si termina en ?, actualiza answer con "Buena pregunta. Vue reaccionó al cambio."
// - si no está vacía, agrega `Cambio detectado: ${newQuestion}` a changeLog.
</script>

<template>
  <!-- Por favor no elimines los atributos data-testid: los tests del challenge los usan para validar tu solución. -->
  <section class="question-watcher">
    <label class="field-label" for="question">Pregunta para Vue</label>
    <input
      id="question"
      v-model="question"
      data-testid="question-input"
      class="field"
      placeholder="¿Vue puede reaccionar?"
    />

    <p data-testid="answer" class="answer">{{ answer }}</p>

    <div class="log-panel">
      <p class="log-title">Cambios detectados</p>
      <p v-if="changeLog.length === 0" class="empty-log">
        Aún no hay cambios registrados.
      </p>
      <ul v-else class="change-log">
        <li
          v-for="(entry, index) in changeLog"
          :key="`${entry}-${index}`"
          data-testid="log-entry"
          class="log-entry"
        >
          {{ entry }}
        </li>
      </ul>
    </div>

    <button data-testid="clear-button" class="btn" @click="clearQuestion">
      Limpiar
    </button>
  </section>
</template>

<style scoped>
/* Por favor no edites estos estilos por ahora: solo dan forma al preview del challenge. */
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
