// client/src/utils/sanitizeAndTruncate.ts

import DOMPurify from "dompurify";

/**
 * Tronque proprement un HTML enrichi à un nombre de caractères visibles donné.
 * Conserve le formatage (gras, italique, couleur, taille, etc.) sans casser le HTML.
 *
 * @param html HTML enrichi (potentiellement sale)
 * @param limit Nombre maximal de caractères visibles
 * @returns Objet contenant { html: string, isTruncated: boolean }
 */
export function sanitizeAndTruncate(
  html: string,
  limit: number,
): { html: string; isTruncated: boolean } {
  const tempDiv = document.createElement("div");

  tempDiv.innerHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "b",
      "i",
      "u",
      "em",
      "strong",
      "a",
      "ul",
      "ol",
      "li",
      "br",
      "span",
      "font",
    ],
    ALLOWED_ATTR: ["href", "target", "style", "color", "size"],
  });

  let textCount = 0;
  let wasTruncated = false;
  const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (!node.nodeValue) continue;

    const remaining = limit - textCount;
    const length = node.nodeValue.length;

    if (textCount + length > limit) {
      node.nodeValue = node.nodeValue.slice(0, remaining).trimEnd();
      wasTruncated = true;
      break;
    }

    textCount += length;
  }

  return {
    html: tempDiv.innerHTML,
    isTruncated: wasTruncated,
  };
}
