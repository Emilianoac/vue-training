<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    backTo: string;
    contentClass?: string;
    warnBeforeLeave?: boolean;
  }>(),
  {
    contentClass: undefined,
    warnBeforeLeave: false,
  },
);

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (!props.warnBeforeLeave) return;

  event.preventDefault();
  event.returnValue = "";
}

onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>

<template>
  <article class="flex h-full min-h-0 flex-col">
    <ActivityHeader :title="title" :back-to="backTo" :warn-before-leave="warnBeforeLeave" />

    <div :class="[' min-h-0 flex-1 overflow-hidden', contentClass]">
      <slot />
    </div>
  </article>
</template>
