import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import legacyCss from "@/legacy/don-cangrejo.css?url";
import { markup } from "@/legacy/markup";
import { decodeUnicodeEscapes, normalizeUnicodeEscapes } from "@/lib/decode-unicode-escapes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "La Receta de Don Cangrejo - Longaniza Pro MX" },
      { name: "description", content: "Calculadora y control de producción profesional de longaniza y charcutería." },
      { property: "og:title", content: "La Receta de Don Cangrejo - Longaniza Pro MX" },
      { property: "og:description", content: "Calculadora y control de producción de longaniza: premix, costeo, checklist e historial." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "theme-color", content: "#0c0e12" },
    ],
    links: [{ rel: "stylesheet", href: legacyCss }],
  }),
  component: Index,
});

function Index() {
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = appRef.current;
    if (!root) return;

    normalizeUnicodeEscapes(root);

    // El motor legacy inserta filas y botones dinámicamente. Normalizarlos también
    // evita que escapes procedentes de datos persistidos se muestren literalmente.
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData" && record.target.parentNode) {
          normalizeUnicodeEscapes(record.target.parentNode);
        }
        for (const node of Array.from(record.addedNodes)) {
          if (node instanceof Element) normalizeUnicodeEscapes(node);
          else if (node instanceof Text) {
            const decoded = decodeUnicodeEscapes(node.nodeValue ?? "");
            if (decoded !== node.nodeValue) node.nodeValue = decoded;
          }
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    import("@/legacy/don-cangrejo.js").then((module) => {
      module.initDonCangrejo();
      normalizeUnicodeEscapes(root);
    });

    return () => observer.disconnect();
  }, []);

  return <div ref={appRef} dangerouslySetInnerHTML={{ __html: decodeUnicodeEscapes(markup) }} />;
}
