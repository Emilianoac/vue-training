import { vi } from "vitest";

vi.mock("@highlightjs/vue-plugin", () => ({
  default: {
    install: vi.fn(),
  },
}));
