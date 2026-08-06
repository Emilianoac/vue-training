import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { describe, expect, it } from "vitest";
import source from "./UserProfile.vue?raw";
// @ts-expect-error Virtual file mounted by the challenge runner.
import UserProfile from "./UserProfile.vue";

async function mountProfile(path: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/users/:id", name: "user", component: UserProfile }],
  });

  await router.push(path);
  await router.isReady();

  const wrapper = mount(UserProfile, {
    global: { plugins: [router] },
  });

  return { router, wrapper };
}

describe("UserProfile.vue", () => {
  it("accesses the current route with useRoute", () => {
    expect(source).toMatch(/\buseRoute\s*\(\s*\)/);
  });

  it("renders the profile selected by the initial parameter", async () => {
    const { wrapper } = await mountProfile("/users/grace");

    expect(wrapper.get('[data-testid="user-id"]').text()).toContain("grace");
    expect(wrapper.get('[data-testid="user-name"]').text()).toBe("Grace Hopper");
  });

  it("updates the profile when the parameter changes without remounting", async () => {
    const { router, wrapper } = await mountProfile("/users/ada");

    expect(wrapper.get('[data-testid="user-name"]').text()).toBe("Ada Lovelace");

    await router.push("/users/margaret");
    await nextTick();

    expect(wrapper.get('[data-testid="user-id"]').text()).toContain("margaret");
    expect(wrapper.get('[data-testid="user-name"]').text()).toBe("Margaret Hamilton");
  });

  it("renders an empty state for an unknown identifier", async () => {
    const { wrapper } = await mountProfile("/users/unknown");

    expect(wrapper.find('[data-testid="user-name"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="not-found"]').text()).toContain("Profile not found");
  });
});
