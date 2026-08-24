import { describe, expect, it } from "vitest";
import {
  baseParse,
  compile,
  generate,
  transform,
} from "@/lib/challenge-runners/webcontainer/challenges/template-compilation/compiler.solution.en";

describe("template compilation challenge solution", () => {
  it("parses nested mixed content", () => {
    const ast = baseParse("<main>Hello {{ user.name }}<span>!</span></main>");
    const main = ast.children[0];

    expect(main).toMatchObject({ type: "Element", tag: "main" });
    if (main?.type !== "Element") throw new Error("Expected main element");
    expect(main.children.map((node) => node.type)).toEqual([
      "Text",
      "Interpolation",
      "Element",
    ]);
  });

  it("rejects malformed or unsupported templates", () => {
    expect(() => baseParse("<div><span></div>")).toThrow(/span/i);
    expect(() => baseParse("<input />")).toThrow(/outside/i);
    expect(() => baseParse("{{ }}")).toThrow(/empty/i);
  });

  it("transforms and generates deterministic render code", () => {
    const ast = transform(baseParse("<p>Hello {{ name }}</p>"));

    expect(generate(ast)).toBe(
      'function render(_ctx, h) {\n  return h("p", null, ["Hello ", String(_ctx.name)]);\n}',
    );
  });

  it("preserves every root node during compilation", () => {
    const result = compile("<h1>{{ title }}</h1><p>Ready</p>");

    expect(result.ast.children).toHaveLength(2);
    expect(result.code).toContain('return [h("h1"');
    expect(result.code).toContain('h("p", null, "Ready")');
  });
});
