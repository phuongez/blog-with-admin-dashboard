import { Node, mergeAttributes } from "@tiptap/core";

export const IframeEmbed = Node.create({
  name: "iframeEmbed",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: "" },
      width: { default: "100%" },
      height: { default: "600" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "iframe",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(HTMLAttributes, {
        frameborder: "0",
        allowfullscreen: "true",
      }),
    ];
  },

  addNodeView() {
    return ({ HTMLAttributes }) => {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", HTMLAttributes.src);
      iframe.setAttribute("width", HTMLAttributes.width || "100%");
      iframe.setAttribute("height", HTMLAttributes.height || "600");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "true");
      return { dom: iframe };
    };
  },
});
