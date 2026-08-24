import { beforeEach, describe, expect, it } from "vitest";
import { createContainer, snapshot } from "../../../app/lib/challenge-runners/webcontainer/challenges/rendering-components/host";
import {
  h,
  render,
  resetRenderer,
  type ComponentDefinition,
} from "../../../app/lib/challenge-runners/webcontainer/challenges/rendering-components/renderer.solution.en";

describe("rendering components challenge solution", () => {
  beforeEach(resetRenderer);

  it("mounts and patches element trees in place", () => {
    const container = createContainer();
    render(h("main", { class: "before", title: "remove" }, [h("p", null, "One")]), container);
    const main = container.children[0];

    render(h("main", { class: "after" }, [h("p", null, "Two")]), container);

    expect(container.children[0]).toBe(main);
    expect(snapshot(container)).toEqual([{
      type: "main",
      props: { class: "after" },
      children: [{ type: "p", props: {}, children: "Two" }],
    }]);
  });

  it("reuses component instances and their compatible host roots", () => {
    const container = createContainer();
    const Card: ComponentDefinition = {
      render: (props) => h("article", { tone: props.tone }, String(props.label)),
    };
    const first = h(Card, { tone: "quiet", label: "One" });
    render(first, container);
    const instance = first.component;
    const article = container.children[0];

    const next = h(Card, { tone: "loud", label: "Two" });
    render(next, container);

    expect(next.component).toBe(instance);
    expect(container.children[0]).toBe(article);
    expect(snapshot(container)).toEqual([{
      type: "article",
      props: { tone: "loud" },
      children: "Two",
    }]);
  });

  it("reconciles keyed component lists and preserves matched nodes", () => {
    const container = createContainer();
    const Row: ComponentDefinition = {
      render: (props) => h("li", { id: props.id }, String(props.id)),
    };
    const row = (id: string) => h(Row, { key: id, id });

    render(h("ul", null, [row("a"), row("b"), row("c")]), container);
    const list = container.children[0];
    if (list?.kind !== "element") throw new Error("Expected list");
    const [a, b, c] = list.children;

    render(h("ul", null, [row("c"), row("a"), row("d")]), container);

    expect(list.children[0]).toBe(c);
    expect(list.children[1]).toBe(a);
    expect(b?.parent).toBeNull();
    expect(snapshot(container)).toEqual([{
      type: "ul",
      props: {},
      children: [
        { type: "li", props: { id: "c" }, children: "c" },
        { type: "li", props: { id: "a" }, children: "a" },
        { type: "li", props: { id: "d" }, children: "d" },
      ],
    }]);
  });
});
