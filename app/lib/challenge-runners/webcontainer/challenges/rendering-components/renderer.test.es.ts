import { beforeEach, describe, expect, it } from "vitest";
import { createContainer, snapshot } from "./host";
// @ts-expect-error Archivo virtual montado en /src/renderer.ts por el runner del challenge.
import {
  h,
  render,
  resetRenderer,
  type ComponentDefinition,
} from "./renderer";

describe("renderer de VNodes", () => {
  beforeEach(resetRenderer);

  it("monta elementos, props, texto y children anidados", () => {
    const container = createContainer();
    render(h("section", { id: "lab", key: "root" }, [
      h("h2", null, "Renderer"),
      h("button", { disabled: true }, "Guardar"),
    ]), container);

    expect(snapshot(container)).toEqual([{
      type: "section",
      props: { id: "lab" },
      children: [
        { type: "h2", props: {}, children: "Renderer" },
        { type: "button", props: { disabled: true }, children: "Guardar" },
      ],
    }]);
  });

  it("actualiza un elemento compatible sin reemplazar su identidad host", () => {
    const container = createContainer();
    render(h("div", { class: "antes", title: "eliminar" }, "Uno"), container);
    const element = container.children[0];

    render(h("div", { class: "después" }, "Dos"), container);

    expect(container.children[0]).toBe(element);
    expect(snapshot(container)).toEqual([{
      type: "div",
      props: { class: "después" },
      children: "Dos",
    }]);
  });

  it("reemplaza identidades type o key incompatibles y desmonta la raíz", () => {
    const container = createContainer();
    render(h("div", { key: "primero" }, "Uno"), container);
    const first = container.children[0]!;

    render(h("span", { key: "segundo" }, "Dos"), container);
    expect(container.children[0]).not.toBe(first);
    expect(first.parent).toBeNull();

    render(null, container);
    expect(container.children).toEqual([]);
  });

  it("cambia children entre texto, arrays y contenido vacío", () => {
    const container = createContainer();
    render(h("div", null, "Texto"), container);
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

  it("reutiliza una instancia y actualiza su subTree renderizado", () => {
    const container = createContainer();
    const Badge: ComponentDefinition = {
      render: (props) => h("strong", { class: props.tone }, String(props.label)),
    };
    const firstVNode = h(Badge, { tone: "quiet", label: "Uno" });
    render(firstVNode, container);
    const instance = firstVNode.component;
    const element = container.children[0];

    const nextVNode = h(Badge, { tone: "loud", label: "Dos" });
    render(nextVNode, container);

    expect(nextVNode.component).toBe(instance);
    expect(container.children[0]).toBe(element);
    expect(snapshot(container)).toEqual([{
      type: "strong",
      props: { class: "loud" },
      children: "Dos",
    }]);
  });

  it("reordena componentes keyed conservando nodos host emparejados", () => {
    const container = createContainer();
    const Row: ComponentDefinition = {
      render: (props) => h("li", { "data-id": props.id }, String(props.label)),
    };
    const row = (id: string, label: string) => h(Row, { key: id, id, label });

    render(h("ul", null, [row("a", "A"), row("b", "B"), row("c", "C")]), container);
    const list = container.children[0];
    if (list?.kind !== "element") throw new Error("Se esperaba un elemento lista");
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
