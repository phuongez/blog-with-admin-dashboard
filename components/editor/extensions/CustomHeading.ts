import { Heading } from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";
import slugify from "slugify";

export const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level || 1;
    return [
      `h${level}`,
      mergeAttributes(HTMLAttributes), // ✅ dùng mergeAttributes thay vì thủ công
      0,
    ];
  },
});
