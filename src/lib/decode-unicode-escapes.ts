/**
 * Convierte secuencias Unicode escapadas que hayan llegado como texto literal.
 * Admite \uXXXX y puntos de código extendidos \u{...} / \uXXXXX.
 * No evalúa código ni interpreta entidades HTML.
 */
export function decodeUnicodeEscapes(value: string): string {
  const decoded = value.replace(/\\\\u(?:\\{([0-9a-fA-F]{1,6})\\}|([0-9a-fA-F]{4,6}))/g, (match, braced: string | undefined, plain: string | undefined) => {
    const digits = braced ?? plain ?? "";
    // Los escapes clásicos \uXXXX siempre tienen cuatro dígitos. Solo se
    // consume el formato de 5-6 dígitos cuando representa un code point
    // suplementario, por ejemplo \u1F9EA, y no una letra posterior.
    const extended = braced !== undefined || (digits.length > 4 && Number.parseInt(digits, 16) > 0xffff);
    const selected = extended ? digits : digits.slice(0, 4);
    const codePoint = Number.parseInt(selected, 16);
    if (!Number.isFinite(codePoint) || codePoint > 0x10ffff) return match;
    const remainder = extended ? "" : digits.slice(4);
    try {
      const character = String.fromCodePoint(codePoint);
      return character + remainder;
    } catch {
      return match;
    }
  });

  return decoded.replace(/CHARCUTERÞA/gi, "CHARCUTERÍA");
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
