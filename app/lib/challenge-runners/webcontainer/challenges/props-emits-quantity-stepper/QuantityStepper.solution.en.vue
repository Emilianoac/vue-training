<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["update:modelValue"]);

function decrease() {
  if (props.modelValue <= props.min) return;

  emit("update:modelValue", props.modelValue - 1);
}

function increase() {
  if (props.modelValue >= props.max) return;

  emit("update:modelValue", props.modelValue + 1);
}
</script>

<template>
  <!-- Please do not remove the data-testid attributes: the challenge tests use them to validate your solution. -->
  <section class="quantity-stepper">
    <span class="eyebrow">Quantity picker</span>

    <div class="controls">
      <button data-testid="decrease-button" class="btn" type="button" @click="decrease">
        -
      </button>

      <output data-testid="quantity-value" class="value">
        {{ props.modelValue }}
      </output>

      <button data-testid="increase-button" class="btn" type="button" @click="increase">
        +
      </button>
    </div>

    <p class="limits">Min {{ props.min }} · Max {{ props.max }}</p>
  </section>
</template>

<style scoped>
/* Please do not edit these styles for now: they only shape the challenge preview. */
.quantity-stepper {
  display: grid;
  gap: 1rem;
  max-width: 24rem;
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

.controls {
  display: grid;
  grid-template-columns: 3rem 1fr 3rem;
  align-items: center;
  gap: 0.75rem;
}

.btn {
  width: 3rem;
  height: 3rem;
  color: var(--primary-foreground);
  font: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 0.375rem;
}

.btn:hover {
  opacity: 0.9;
}

.value {
  display: grid;
  min-height: 3rem;
  place-items: center;
  color: var(--foreground);
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

.limits {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.875rem;
  text-align: center;
}
</style>
