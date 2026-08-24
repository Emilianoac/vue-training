import { describe, expect, it } from "vitest";
// @ts-expect-error Virtual file mounted at /src/compiler.ts by the challenge runner.
import { baseParse, compile, generate, transform } from "./compiler";

describe("reduced template compiler", () => {
  it("parses text and trimmed interpolations", () => {
    const ast = baseParse("Hello {{ user.name }}!");

    expect(ast.children).toEqual([
      { type: "Text", content: "Hello " },
      { type: "Interpolation", content: "user.name" },
      { type: "Text", content: "!" },
    ]);
  });

  it("parses nested elements with mixed children", () => {
    const ast = baseParse("<section><h2>Title</h2><p>{{ message }}</p></section>");
    const section = ast.children[0];

    expect(section).toMatchObject({ type: "Element", tag: "section" });
    if (section?.type !== "Element") throw new Error("Expected section element");
    expect(section.children).toHaveLength(2);
    expect(section.children[1]).toMatchObject({ type: "Element", tag: "p" });
  });

  it("reports missing, mismatched, and unsupported syntax", () => {
    expect(() => baseParse("{{ open")).toThrow(/missing/i);
    expect(() => baseParse("<div><span></div>")).toThrow(/span/i);
    expect(() => baseParse("<div id=\"app\"></div>")).toThrow(/outside|attribute/i);
  });

  it("transforms nodes into render expressions", () => {
    const ast = transform(baseParse("<p>Hello {{ name }}</p>"));
    const paragraph = ast.children[0];

    expect(ast.codegenNode).toContain('h("p"');
    expect(paragraph?.codegenNode).toContain("String(_ctx.name)");
  });

  it("generates one render function for a single root", () => {
    const ast = transform(baseParse("<h1>{{ title }}</h1>"));
    const code = generate(ast);

    expect(code).toContain("function render(_ctx, h)");
    expect(code).toContain('h("h1", null, String(_ctx.title))');
  });

  it("compiles multiple root nodes without dropping any child", () => {
    const result = compile("<h1>{{ title }}</h1><p>Ready</p>");

    expect(result.ast.children).toHaveLength(2);
    expect(result.code).toContain('return [h("h1"');
    expect(result.code).toContain('h("p", null, "Ready")');
  });
});
