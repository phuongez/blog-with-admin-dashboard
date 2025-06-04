// extensions/YoutubeEmbed.ts
import { Node, mergeAttributes } from "@tiptap/core";

export const YoutubeEmbed = Node.create({
  name: "youtubeEmbed",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes({
        width: "560",
        height: "315",
        frameborder: "0",
        allowfullscreen: "true",
        ...HTMLAttributes,
      }),
    ];
  },

  addNodeView() {
    return ({ HTMLAttributes }) => {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", HTMLAttributes.src);
      iframe.setAttribute("width", "560");
      iframe.setAttribute("height", "315");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "true");
      return {
        dom: iframe,
      };
    };
  },
});
