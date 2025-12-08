import { expect, vi } from "vitest";

vi.mock("@highlightjs/vue-plugin", () => {
  return {
    default: {
      install: () => {}
    }
  };
});