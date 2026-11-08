/**
 * Convierte secuencias Unicode escapadas que hayan llegado como texto literal.
 * No evalúa código ni interpreta entidades HTML.
 */
export function decodeUnicodeEscapes(value: string): string {
  return value.replace(/\\\\u(?:\\{([0-9a-fA-F]{1,6})\\}|([0-9a-fA-F]{4,6}))/g, (match, braced: string | undefined, plain: string | undefined) => {
    const codePoint = Number.parseInt(braced ?? plain, 16);
    if (!Number.isFinite(codePoint) || codePoint > 0x10ffff) return match;
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return match;
    }
  });
}

export function normalizeUnicodeEscapes(root: ParentNode): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  for (const node of textNodes) {
    const decoded = decodeUnicodeEscapes(node.nodeValue ?? "");
    if (decoded !== node.nodeValue) node.nodeValue = decoded;
  }

  if (root instanceof Element) {
    for (const element of [root, ...Array.from(root.querySelectorAll("*"))]) {
      for (const attribute of Array.from(element.attributes)) {
        const decoded = decodeUnicodeEscapes(attribute.value);
        if (decoded !== attribute.value) element.setAttribute(attribute.name, decoded);
      }
    }
  }
}
