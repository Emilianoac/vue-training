import { beforeEach, describe, expect, it } from "vitest";
import { createContainer, snapshot } from "./host";
// @ts-expect-error Virtual file mounted at /src/renderer.ts by the challenge runner.
import {
  h,
  render,
  resetRenderer,
  type ComponentDefinition,
} from "./renderer";

describe("VNode renderer", () => {
  beforeEach(resetRenderer);

  it("mounts elements, props, text, and nested children", () => {
    const container = createContainer();
    render(h("section", { id: "lab", key: "root" }, [
      h("h2", null, "Renderer"),
      h("button", { disabled: true }, "Save"),
    ]), container);

    expect(snapshot(container)).toEqual([{
      type: "section",
      props: { id: "lab" },
      children: [
        { type: "h2", props: {}, children: "Renderer" },
        { type: "button", props: { disabled: true }, children: "Save" },
      ],
    }]);
  });

  it("patches a compatible element without replacing its host identity", () => {
    const container = createContainer();
    render(h("div", { class: "before", title: "remove" }, "One"), container);
    const element = container.children[0];

    render(h("div", { class: "after" }, "Two"), container);

    expect(container.children[0]).toBe(element);
    expect(snapshot(container)).toEqual([{
      type: "div",
      props: { class: "after" },
      children: "Two",
    }]);
  });

  it("replaces incompatible type or key identities and supports root unmount", () => {
    const container = createContainer();
    render(h("div", { key: "first" }, "One"), container);
    const first = container.children[0]!;

    render(h("span", { key: "second" }, "Two"), container);
    expect(container.children[0]).not.toBe(first);
    expect(first.parent).toBeNull();

    render(null, container);
    expect(container.children).toEqual([]);
  });

  it("transitions children between text, arrays, and empty content", () => {
    const container = createContainer();
    render(h("div", null, "Text"), container);
    render(h("div", null, [h("span", null, "A"), h("span", null, "B")]), container);
    expect(snapshot(container)).toEqual([{
      type: "div",
      props: {},
      children: [
        { type: "span", props: {}, children: "A" },
        { type: "span", props: {}, children: "B" },
      ],
    }]);

    render(h("div"), container);
    expect(snapshot(container)).toEqual([{ type: "div", props: {}, children: [] }]);
  });

  it("reuses a component instance and patches its rendered subtree", () => {
    const container = createContainer();
    const Badge: ComponentDefinition = {
      render: (props) => h("strong", { class: props.tone }, String(props.label)),
    };
    const firstVNode = h(Badge, { tone: "quiet", label: "One" });
    render(firstVNode, container);
    const instance = firstVNode.component;
    const element = container.children[0];

    const nextVNode = h(Badge, { tone: "loud", label: "Two" });
    render(nextVNode, container);

    expect(nextVNode.component).toBe(instance);
    expect(container.children[0]).toBe(element);
    expect(snapshot(container)).toEqual([{
      type: "strong",
      props: { class: "loud" },
      children: "Two",
    }]);
  });

  it("reorders keyed components while preserving matched host nodes", () => {
    const container = createContainer();
    const Row: ComponentDefinition = {
      render: (props) => h("li", { "data-id": props.id }, String(props.label)),
    };
    const row = (id: string, label: string) => h(Row, { key: id, id, label });

    render(h("ul", null, [row("a", "A"), row("b", "B"), row("c", "C")]), container);
    const list = container.children[0];
    if (list?.kind !== "element") throw new Error("Expected list element");
    const [a, b, c] = list.children;

    render(h("ul", null, [row("c", "C"), row("a", "A"), row("d", "D")]), container);

    expect(list.children[0]).toBe(c);
    expect(list.children[1]).toBe(a);
    expect(b?.parent).toBeNull();
    expect(snapshot(container)).toEqual([{
      type: "ul",
      props: {},
      children: [
        { type: "li", props: { "data-id": "c" }, children: "C" },
        { type: "li", props: { "data-id": "a" }, children: "A" },
        { type: "li", props: { "data-id": "d" }, children: "D" },
      ],
    }]);
  });
});
