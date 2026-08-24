import { describe, expect, it } from "vitest";
// @ts-expect-error Archivo virtual montado en /src/compiler.ts por el runner del challenge.
import { baseParse, compile, generate, transform } from "./compiler";

describe("compilador reducido de templates", () => {
  it("analiza texto e interpolaciones limpias", () => {
    const ast = baseParse("Hola {{ user.name }}!");

    expect(ast.children).toEqual([
      { type: "Text", content: "Hola " },
      { type: "Interpolation", content: "user.name" },
      { type: "Text", content: "!" },
    ]);
  });

  it("analiza elementos anidados con children mixtos", () => {
    const ast = baseParse("<section><h2>Título</h2><p>{{ message }}</p></section>");
    const section = ast.children[0];

    expect(section).toMatchObject({ type: "Element", tag: "section" });
    if (section?.type !== "Element") throw new Error("Se esperaba un elemento section");
    expect(section.children).toHaveLength(2);
    expect(section.children[1]).toMatchObject({ type: "Element", tag: "p" });
  });

  it("informa sintaxis ausente, incorrecta o no soportada", () => {
    expect(() => baseParse("{{ open")).toThrow(/ausente|missing/i);
    expect(() => baseParse("<div><span></div>")).toThrow(/span/i);
    expect(() => baseParse("<div id=\"app\"></div>")).toThrow(/gramática|outside|atributo/i);
  });

  it("transforma nodos en expresiones de render", () => {
    const ast = transform(baseParse("<p>Hola {{ name }}</p>"));
    const paragraph = ast.children[0];

    expect(ast.codegenNode).toContain('h("p"');
    expect(paragraph?.codegenNode).toContain("String(_ctx.name)");
  });

  it("genera una función de render para una raíz única", () => {
    const ast = transform(baseParse("<h1>{{ title }}</h1>"));
    const code = generate(ast);

    expect(code).toContain("function render(_ctx, h)");
    expect(code).toContain('h("h1", null, String(_ctx.title))');
  });

  it("compila múltiples nodos raíz sin perder ningún child", () => {
    const result = compile("<h1>{{ title }}</h1><p>Listo</p>");

    expect(result.ast.children).toHaveLength(2);
    expect(result.code).toContain('return [h("h1"');
    expect(result.code).toContain('h("p", null, "Listo")');
  });
});
