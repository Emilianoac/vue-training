export type RootNode = {
  type: "Root";
  children: TemplateNode[];
  codegenNode?: string;
};

export type ElementNode = {
  type: "Element";
  tag: string;
  children: TemplateNode[];
  codegenNode?: string;
};

export type TextNode = {
  type: "Text";
  content: string;
  codegenNode?: string;
};

export type InterpolationNode = {
  type: "Interpolation";
  content: string;
  codegenNode?: string;
};

export type TemplateNode = ElementNode | TextNode | InterpolationNode;
type ParentNode = RootNode | ElementNode;
type ParserContext = { source: string };

export type CompileResult = {
  ast: RootNode;
  code: string;
};

export function baseParse(template: string): RootNode {
  const context: ParserContext = { source: template };
  const children = parseChildren(context, []);

  if (context.source.length > 0) {
    throw new Error(`Unexpected template content: ${context.source.slice(0, 12)}`);
  }

  return { type: "Root", children };
}

function parseChildren(context: ParserContext, ancestors: ElementNode[]): TemplateNode[] {
  const nodes: TemplateNode[] = [];

  while (!isEnd(context, ancestors)) {
    if (context.source.startsWith("{{")) {
      nodes.push(parseInterpolation(context));
    } else if (context.source.startsWith("<")) {
      if (/^<\/[A-Za-z]/.test(context.source)) {
        throw new Error(`Unexpected closing tag near ${context.source.slice(0, 12)}`);
      }

      if (/^<[A-Za-z]/.test(context.source)) {
        nodes.push(parseElement(context, ancestors));
      } else {
        throw new Error(`Unsupported template syntax near ${context.source.slice(0, 12)}`);
      }
    } else {
      nodes.push(parseText(context));
    }
  }

  return nodes;
}

function parseInterpolation(context: ParserContext): InterpolationNode {
  const closeIndex = context.source.indexOf("}}", 2);
  if (closeIndex < 0) throw new Error("Interpolation is missing }}");

  advanceBy(context, 2);
  const content = context.source.slice(0, closeIndex - 2).trim();
  advanceBy(context, closeIndex);

  if (!content) throw new Error("Interpolation expression cannot be empty");
  return { type: "Interpolation", content };
}

function parseElement(context: ParserContext, ancestors: ElementNode[]): ElementNode {
  const element = parseTag(context, "start");
  ancestors.push(element);
  element.children = parseChildren(context, ancestors);
  ancestors.pop();

  if (!startsWithEndTagOpen(context.source, element.tag)) {
    throw new Error(`Missing closing tag for <${element.tag}>`);
  }

  parseTag(context, "end");
  return element;
}

function parseTag(context: ParserContext, kind: "start" | "end"): ElementNode {
  const pattern = kind === "start" ? /^<([A-Za-z][\w-]*)/ : /^<\/([A-Za-z][\w-]*)/;
  const match = pattern.exec(context.source);
  if (!match) throw new Error(`Invalid ${kind} tag`);

  const tag = match[1]!;
  advanceBy(context, match[0].length);
  const whitespace = /^\s*/.exec(context.source)?.[0].length ?? 0;
  advanceBy(context, whitespace);

  if (!context.source.startsWith(">")) {
    throw new Error("Attributes and self-closing tags are outside this grammar");
  }

  advanceBy(context, 1);
  return { type: "Element", tag, children: [] };
}

function parseText(context: ParserContext): TextNode {
  let endIndex = context.source.length;

  for (const marker of ["{{", "<"]) {
    const markerIndex = context.source.indexOf(marker);
    if (markerIndex >= 0 && markerIndex < endIndex) endIndex = markerIndex;
  }

  if (endIndex === 0) throw new Error("Parser did not consume any text");
  const content = context.source.slice(0, endIndex);
  advanceBy(context, endIndex);
  return { type: "Text", content };
}

function isEnd(context: ParserContext, ancestors: ElementNode[]) {
  if (!context.source) return true;

  for (let index = ancestors.length - 1; index >= 0; index--) {
    if (startsWithEndTagOpen(context.source, ancestors[index]!.tag)) return true;
  }

  return false;
}

function startsWithEndTagOpen(source: string, tag: string) {
  return source.toLowerCase().startsWith(`</${tag.toLowerCase()}`)
    && /[\t\r\n\f />]/.test(source[2 + tag.length] ?? ">");
}

function advanceBy(context: ParserContext, length: number) {
  context.source = context.source.slice(length);
}

export function transform(root: RootNode): RootNode {
  traverseNode(root);
  return root;
}

function traverseNode(node: ParentNode | TemplateNode) {
  if (node.type === "Text") {
    node.codegenNode = JSON.stringify(node.content);
    return;
  }

  if (node.type === "Interpolation") {
    if (!/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(node.content)) {
      throw new Error(`Unsupported interpolation expression: ${node.content}`);
    }
    node.codegenNode = `String(_ctx.${node.content})`;
    return;
  }

  for (const child of node.children) traverseNode(child);

  if (node.type === "Element") {
    const children = generateChildrenExpression(node.children);
    node.codegenNode = `h(${JSON.stringify(node.tag)}, null, ${children})`;
  } else {
    node.codegenNode = node.children.length === 1
      ? node.children[0]!.codegenNode
      : `[${node.children.map((child) => child.codegenNode).join(", ")}]`;
  }
}

function generateChildrenExpression(children: TemplateNode[]) {
  if (children.length === 0) return "null";
  if (children.length === 1) return children[0]!.codegenNode!;
  return `[${children.map((child) => child.codegenNode).join(", ")}]`;
}

export function generate(root: RootNode): string {
  if (!root.codegenNode) transform(root);
  return `function render(_ctx, h) {\n  return ${root.codegenNode ?? "null"};\n}`;
}

export function compile(template: string): CompileResult {
  const ast = baseParse(template);
  transform(ast);
  return { ast, code: generate(ast) };
}
