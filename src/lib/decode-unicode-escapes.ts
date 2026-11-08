/**
 * Decodifica escapes Unicode que llegaron como texto literal desde el motor
 * heredado o desde datos persistidos. No evalúa código ni HTML.
 */
export function decodeUnicodeEscapes(value: string): string {
  return value.replace(/\\u(?:\{([0-9a-fA-F]{1,6})\}|([0-9a-fA-F]{4,6}))/g,
    (match, braced: string | undefined, plain: string | undefined) => {
      const digits = braced ?? plain ?? "";
      // \uXXXX consume exactamente cuatro dígitos. El formato extendido
      // \u1F9EA se acepta cuando el valor requiere más de cuatro.
      const isExtended = braced !== undefined ||
        (digits.length > 4 && Number.parseInt(digits, 16) > 0xffff);
      const selected = isExtended ? digits : digits.slice(0, 4);
      const remainder = isExtended ? "" : digits.slice(4);
      const codePoint = Number.parseInt(selected, 16);

      if (!Number.isFinite(codePoint) || codePoint > 0x10ffff) return match;
      try {
        return String.fromCodePoint(codePoint) + remainder;
      } catch {
        return match;
      }
    }
  );
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
