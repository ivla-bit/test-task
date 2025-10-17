import sanitizeHtml from "sanitize-html";
import he from "he";

export function sanitizeCommentInput(content: string) {
  const decoded = he.decode(content || "");

  const clean = sanitizeHtml(decoded, {
    allowedTags: ["a", "code", "i", "strong"],
    allowedAttributes: {
      a: ["href", "title"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: {
          href: attribs.href || "#",
          title: attribs.title || "",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    },

    parser: {
      lowerCaseTags: true,
      decodeEntities: true,
    },
  });

  return clean;
}
