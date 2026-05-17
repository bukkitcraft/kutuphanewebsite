import sanitizeHtml from "sanitize-html";

export function sanitizePlainText(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
}

/** Sadece Google Haritalar embed iframe src URL’leri */
export function sanitizeGoogleMapsEmbedUrl(raw: string): string {
  const t = sanitizePlainText(raw).trim();
  if (!t) return "";
  try {
    const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    const u = new URL(withProto);
    if (u.protocol !== "https:") return "";
    const host = u.hostname.toLowerCase();
    if (host !== "www.google.com" && host !== "google.com") return "";
    if (!u.pathname.toLowerCase().startsWith("/maps/embed")) return "";
    return u.toString().slice(0, 2800);
  } catch {
    return "";
  }
}

export function sanitizeRichHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "div",
      "span",
      "font",
      "b",
      "i",
      "u",
      "s",
      "strike",
      "del",
      "strong",
      "em",
      "sub",
      "sup",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
      "br",
      "hr",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "colgroup",
      "col",
      "caption"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "style"],
      img: ["src", "alt", "width", "height", "style"],
      p: ["style"],
      div: ["style"],
      span: ["style"],
      font: ["color", "face", "size", "style"],
      table: ["class", "style", "width", "border", "cellpadding", "cellspacing"],
      thead: ["style"],
      tbody: ["style"],
      tr: ["style"],
      th: ["style", "colspan", "rowspan", "width"],
      td: ["style", "colspan", "rowspan", "width"],
      col: ["width", "span", "style"],
      colgroup: ["width", "span", "style"]
    },
    allowedStyles: {
      "*": {
        color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/, /^rgba\(/],
        "background-color": [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(/, /^rgba\(/, /^transparent$/],
        "font-size": [/^\d+(\.\d+)?(px|pt|em|rem|%)$/],
        "font-family": [/^[-\w\s",.'']+$/],
        "text-align": [/^left|center|right|justify$/],
        width: [/^\d+(\.\d+)?(px|%)$/],
        height: [/^\d+(\.\d+)?(px|%)$/],
        "line-height": [/^\d+(\.\d+)?(px|em|rem|%)?$/],
        "margin-left": [/^-?\d+(\.\d+)?(px|em)$/],
        "margin-right": [/^-?\d+(\.\d+)?(px|em)$/],
        "padding-left": [/^\d+(\.\d+)?(px|em)$/],
        float: [/^left|right|none$/]
      }
    },
    allowedSchemes: ["http", "https", "data", "mailto"]
  }).trim();
}
