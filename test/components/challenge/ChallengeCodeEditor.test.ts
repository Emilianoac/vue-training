import { it, describe, expect } from "vitest";
import { i18nTest } from "../../i18nTest";
import { mount } from "@vue/test-utils";
import ChallengeCodeEditor from "../../../app/components/challenge/ChallengeCodeEditorLayout.vue";
import { nextTick } from "vue";


const stackblitzUrl = "https://stackblitz.com/edit/vitejs-vite-vyvqxdxd?file=README.md";

describe("Challenge Code Editor", () => {

  it("should render the iframe with the stackblitz url", async () => {
    const wrapper = mount(ChallengeCodeEditor, {
      props: {
        stackblitzUrl: stackblitzUrl,
      },
      global: {
        plugins: [i18nTest],
      },
    });
    const iframe = wrapper.find("[data-test='stackblitz-iframe']");

    await iframe.trigger("load");
    await nextTick();

    expect(wrapper.emitted("iframe-loaded")).toBeTruthy();
  });

  describe("when the editor is collapsed", () => {

    it("should expand the editor when the expand button is clicked", async () => {
      const wrapper = mount(ChallengeCodeEditor, {
        props: {
          stackblitzUrl: stackblitzUrl,
        },
        global: {
          plugins: [i18nTest],
        },
      });
      const toggleButton = wrapper.find("[data-test='toggle-editor']");
      const challengePlayground = wrapper.find("[data-test='challenge-playground']");
  
      await toggleButton.trigger("click");
  
      expect(challengePlayground.classes()).toContain("expand-editor");
    });

    it("should reduce the size of the editor when the collapse button is clicked", async () => {
      const wrapper = mount(ChallengeCodeEditor, {
        props: {
          stackblitzUrl: stackblitzUrl,
        },
        global: {
          plugins: [i18nTest],
        },
      });
      const toggleButton = wrapper.find("[data-test='toggle-editor']");
      const challengePlayground = wrapper.find("[data-test='challenge-playground']");
  
      await toggleButton.trigger("click");
      await toggleButton.trigger("click");
  
      expect(challengePlayground.classes()).not.toContain("expand-editor");
    });
  });
});