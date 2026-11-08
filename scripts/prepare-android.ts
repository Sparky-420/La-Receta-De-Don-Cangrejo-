import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { markup } from '../src/legacy/markup';
import { decodeUnicodeEscapes } from '../src/lib/decode-unicode-escapes';

// Run with Bun. The Android app loads this static page directly in WebView;
// it does not run the TanStack/React route, so Unicode normalization must
// be included in this generated entry point.
const destination = process.argv[2];
if (!destination) throw new Error('Usage: bun scripts/prepare-android.ts /tmp/android-project');
const root = resolve(destination);
await mkdir(`${root}/www`, { recursive: true });
await copyFile('src/legacy/don-cangrejo.js', `${root}/www/don-cangrejo.js`);
await copyFile('src/legacy/don-cangrejo.css', `${root}/www/don-cangrejo.css`);

const decodedMarkup = decodeUnicodeEscapes(markup);
const unicodeRuntime = `
<script>
(function () {
  function decodeUnicodeEscapes(value) {
    return value.replace(/\\\\u(?:\\{([0-9a-fA-F]{1,6})\\}|([0-9a-fA-F]{4,6}))/g,
      function (match, braced, plain) {
        var digits = braced || plain || '';
        var extended = !!braced || (digits.length > 4 && parseInt(digits, 16) > 0xffff);
        var selected = extended ? digits : digits.slice(0, 4);
        var remainder = extended ? '' : digits.slice(4);
        var codePoint = parseInt(selected, 16);
        if (!Number.isFinite(codePoint) || codePoint > 0x10ffff) return match;
        try { return String.fromCodePoint(codePoint) + remainder; }
        catch (_) { return match; }
      });
  }

  function normalize(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      var text = decodeUnicodeEscapes(node.nodeValue || '');
      if (text !== node.nodeValue) node.nodeValue = text;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.attributes).forEach(function (attribute) {
        var decoded = decodeUnicodeEscapes(attribute.value);
        if (decoded !== attribute.value) node.setAttribute(attribute.name, decoded);
      });
    }
    Array.from(node.childNodes).forEach(normalize);
  }

  normalize(document.body);
  var observer = new MutationObserver(function (records) {
    records.forEach(function (record) {
      if (record.type === 'characterData') normalize(record.target);
      record.addedNodes.forEach(normalize);
    });
  });
  observer.observe(document.body, { subtree: true, childList: true, characterData: true });
})();
</script>`;

await writeFile(`${root}/www/index.html`, `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Don Cangrejo Pro</title>
<meta name="description" content="Calculadora y control de producción de longaniza.">
<link rel="stylesheet" href="don-cangrejo.css"></head>
<body>${decodedMarkup}${unicodeRuntime}
<script type="module">import { initDonCangrejo } from './don-cangrejo.js'; initDonCangrejo();</script></body></html>`);
await writeFile(`${root}/package.json`, JSON.stringify({
  name: 'don-cangrejo-android', version: '1.0.0', private: true,
  dependencies: { '@capacitor/core': '7.4.3', '@capacitor/android': '7.4.3' },
  devDependencies: { '@capacitor/cli': '7.4.3' },
}, null, 2));
await writeFile(`${root}/capacitor.config.json`, JSON.stringify({
  appId: 'mx.doncangrejo.pro', appName: 'Don Cangrejo Pro', webDir: 'www',
  server: { androidScheme: 'https' },
}, null, 2));
console.log(`Android web assets prepared in ${root}; Unicode normalization enabled in WebView.`);
