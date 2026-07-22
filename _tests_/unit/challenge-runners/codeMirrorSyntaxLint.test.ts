import { describe, expect, it } from "vitest";
import { javascript } from "@codemirror/lang-javascript";
import { vue } from "@codemirror/lang-vue";
import { EditorState, type Extension } from "@codemirror/state";
import { findSyntaxDiagnostics } from "@/components/challenge/challenge-runner/CodeMirrorEditor.lint";

function createState(doc: string, language: Extension) {
  return EditorState.create({ doc, extensions: [language] });
}

describe("CodeMirror syntax diagnostics", () => {
  it("does not report valid JavaScript", () => {
    const state = createState("const count = ref(0);", javascript());

    expect(findSyntaxDiagnostics(state, "Syntax error")).toEqual([]);
  });

  it("reports invalid JavaScript", () => {
    const state = createState("setInterval(() => ){", javascript());

    expect(findSyntaxDiagnostics(state, "Syntax error")).toEqual([
      expect.objectContaining({
        message: "Syntax error",
        severity: "error",
      }),
    ]);
  });

  it("reports JavaScript errors inside Vue files", () => {
    const state = createState(
      `<script setup>\nsetInterval(() => ){\n</script>`,
      vue(),
    );

    const diagnostics = findSyntaxDiagnostics(state, "Error de sintaxis");

    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]).toMatchObject({
      message: "Error de sintaxis",
      severity: "error",
    });
    expect(diagnostics[0]!.to).toBeGreaterThan(diagnostics[0]!.from);
  });
});
