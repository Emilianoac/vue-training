type SectionPosition = {
  id: string;
  top: number;
};

export function findActiveLessonSection(
  sections: SectionPosition[],
  activationLine: number,
  reachedEnd = false,
) {
  if (reachedEnd) return sections.at(-1)?.id ?? "";

  let activeSectionId = sections[0]?.id ?? "";

  for (const section of sections) {
    if (section.top > activationLine) break;
    activeSectionId = section.id;
  }

  return activeSectionId;
}

export function useLessonScrollSpy(container: Ref<HTMLElement | null>) {
  const activeSectionId = ref("");
  let scrollViewport: HTMLElement | null = null;
  let animationFrame: number | null = null;

  onBeforeUnmount(removeScrollListener);

  async function refresh() {
    removeScrollListener();
    await nextTick();

    scrollViewport = container.value?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    ) ?? null;

    if (!scrollViewport) return;

    scrollViewport.addEventListener("scroll", scheduleUpdate, { passive: true });
    updateActiveSection();
  }

  function scheduleUpdate() {
    if (animationFrame !== null) return;

    animationFrame = window.requestAnimationFrame(() => {
      animationFrame = null;
      updateActiveSection();
    });
  }

  function updateActiveSection() {
    if (!container.value || !scrollViewport) return;

    const activationLine = scrollViewport.getBoundingClientRect().top + 24;
    const sections = Array.from(
      container.value.querySelectorAll<HTMLElement>("[data-lesson-section]"),
    ).map((section) => ({
      id: section.dataset.lessonSection ?? "",
      top: section.getBoundingClientRect().top,
    }));
    const reachedEnd =
      scrollViewport.scrollTop + scrollViewport.clientHeight >=
      scrollViewport.scrollHeight - 1;

    activeSectionId.value = findActiveLessonSection(
      sections,
      activationLine,
      reachedEnd,
    );
  }

  function removeScrollListener() {
    scrollViewport?.removeEventListener("scroll", scheduleUpdate);
    scrollViewport = null;

    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  return {
    activeSectionId,
    refresh,
  };
}
