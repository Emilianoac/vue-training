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

export type TextNode = { type: "Text"; content: string; codegenNode?: string };
export type InterpolationNode = { type: "Interpolation"; content: string; codegenNode?: string };
export type TemplateNode = ElementNode | TextNode | InterpolationNode;
type ParentNode = RootNode | ElementNode;
type ParserContext = { source: string };

export type CompileResult = { ast: RootNode; code: string };

export function baseParse(template: string): RootNode {
  const context: ParserContext = { source: template };

  // TODO: parse all root children and reject unconsumed source.
  void context;
  return { type: "Root", children: [] };
}

function parseChildren(context: ParserContext, ancestors: ElementNode[]): TemplateNode[] {
  // TODO: dispatch interpolation, element, and text nodes until the active ancestor closes.
  void context;
  void ancestors;
  return [];
}

function parseInterpolation(context: ParserContext): InterpolationNode {
  // TODO: consume {{ and }}, trim the expression, and report a missing delimiter.
  void context;
  throw new Error("TODO: parse interpolation");
}

function parseElement(context: ParserContext, ancestors: ElementNode[]): ElementNode {
  // TODO: parse a start tag, its nested children, and the matching end tag.
  void context;
  void ancestors;
  throw new Error("TODO: parse element");
}

function parseText(context: ParserContext): TextNode {
  // TODO: consume text up to the closest {{ or < marker.
  void context;
  throw new Error("TODO: parse text");
}

function parseTag(context: ParserContext, kind: "start" | "end"): ElementNode {
  // TODO: read one supported tag, consume >, and reject attributes or self-closing syntax.
  void context;
  void kind;
  throw new Error("TODO: parse tag");
}

function isEnd(context: ParserContext, ancestors: ElementNode[]) {
  // TODO: stop at end of source or when an active ancestor's closing tag starts.
  void context;
  void ancestors;
  return true;
}

function startsWithEndTagOpen(source: string, tag: string) {
  // TODO: compare the closing tag without accepting partial tag-name matches.
  void source;
  void tag;
  return false;
}

function advanceBy(context: ParserContext, length: number) {
  // TODO: remove exactly the consumed prefix from context.source.
  void context;
  void length;
}

export function transform(root: RootNode): RootNode {
  // TODO: attach codegenNode expressions to text, interpolation, element, and root nodes.
  return root;
}

function traverseNode(node: ParentNode | TemplateNode) {
  // TODO: transform children first, then build the current node's codegen expression.
  void node;
}

function generateChildrenExpression(children: TemplateNode[]) {
  // TODO: distinguish empty, single, and multiple children.
  void children;
  return "null";
}

export function generate(root: RootNode): string {
  // TODO: emit function render(_ctx, h) and return the root codegen expression.
  void root;
  throw new Error("TODO: generate render function");
}

export function compile(template: string): CompileResult {
  // TODO: connect parse, transform, and generate.
  void template;
  throw new Error("TODO: compile template");
}
