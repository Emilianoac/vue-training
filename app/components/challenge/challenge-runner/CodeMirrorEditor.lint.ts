import type { EditorState } from "@codemirror/state";
import type { Diagnostic } from "@codemirror/lint";
import { linter } from "@codemirror/lint";
import { syntaxTree } from "@codemirror/language";

export function createSyntaxLintExtension(message: string) {
  return linter((view) => findSyntaxDiagnostics(view.state, message), {
    delay: 300,
  });
}

export function findSyntaxDiagnostics(state: EditorState, message: string): Diagnostic[] {
  const ranges: Array<{ from: number; to: number }> = [];

  syntaxTree(state).iterate({
    enter(node) {
      if (!node.type.isError) return;
      ranges.push(expandEmptyRange(state, node.from, node.to));
    },
  });

  return mergeAdjacentRanges(state, ranges).map(({ from, to }) => ({
    from,
    message,
    severity: "error",
    source: "CodeMirror",
    to,
  }));
}

function expandEmptyRange(state: EditorState, from: number, to: number) {
  if (from !== to || state.doc.length === 0) return { from, to };

  const line = state.doc.lineAt(from);
  if (from < line.to) return { from, to: from + 1 };
  if (from > line.from) return { from: from - 1, to };
  return { from, to };
}

function mergeAdjacentRanges(
  state: EditorState,
  ranges: Array<{ from: number; to: number }>,
) {
  return ranges.reduce<Array<{ from: number; to: number }>>((merged, range) => {
    const previous = merged.at(-1);
    const sameLine =
      previous && state.doc.lineAt(previous.to).number === state.doc.lineAt(range.from).number;

    if (previous && sameLine && range.from <= previous.to) {
      previous.to = Math.max(previous.to, range.to);
      return merged;
    }

    merged.push({ ...range });
    return merged;
  }, []);
}
