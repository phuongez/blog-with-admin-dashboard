"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Youtube,
  ExternalLink,
} from "lucide-react";
import LinkPopover from "./editor/LinkPopover";
import { IframeEmbed } from "./editor/extensions/IframeEmbed";
import TextAlign from "@tiptap/extension-text-align";
import { CustomHeading } from "./editor/extensions/CustomHeading";
import slugify from "slugify";
import { YoutubeEmbed } from "./editor/extensions/YoutubeEmbed";
import { Card } from "./ui/card";
type Props = {
  content: string;
  onChange: (html: string) => void;
};

export default function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
      }),
      CustomHeading.configure({
        levels: [1, 2], // hỗ trợ H1, H2
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: false,
      }),
      HorizontalRule,
      IframeEmbed,
      YoutubeEmbed,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const doc = editor.state.doc;
      const { tr } = editor.state;

      doc.descendants((node, pos) => {
        if (node.type.name === "heading") {
          const currentId = node.attrs.id;
          const content = node.textContent;
          const slug = slugify(content, { lower: true, strict: true });

          // Gán lại nếu chưa có id hoặc id không đúng với nội dung hiện tại
          if (!currentId || currentId !== slug) {
            console.log(`Gán lại id từ "${currentId}" → "${slug}"`);
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              id: slug,
            });
          }
        }
      });

      if (tr.docChanged) {
        editor.view.dispatch(tr);
      }

      onChange(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          "prose prose-base dark:prose-invert focus:outline-none min-h-[400px] p-4 rounded-md",
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of items) {
          if (item.type.indexOf("image") === 0) {
            const file = item.getAsFile();
            if (file) {
              uploadImage(file).then((url) => {
                editor?.chain().focus().setImage({ src: url }).run();
              });
              return true;
            }
          }
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  if (!editor) return null;

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload"); // đổi nếu cần
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ds30pv4oa/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  }

  const addImageManually = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      }
    };

    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="fixed max-w-3xl mx-auto top-[12rem] left-0 right-0 z-50 bg-white/95 p-2 border-none flex flex-wrap gap-1 justify-start overflow-x-auto w-full sm:justify-center sm:overflow-visible">
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="In đậm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="In nghiêng"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Gạch ngang"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={18} />
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Đầu mục 1"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Đầu mục 2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={18} />
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Danh sách"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Danh sách số"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Trích dẫn"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={18} />
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Khung"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code size={18} />
        </button>
        <LinkPopover
          selectedText={editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            " "
          )}
          onSubmit={(url) => {
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
        />

        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Chèn ảnh"
          onClick={addImageManually}
        >
          <ImageIcon size={18} />
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Chia đoạn"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={18} />
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Nhúng iframe"
          onClick={() => {
            const url = prompt("Nhập URL iframe:");
            if (url) {
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "iframeEmbed",
                  attrs: {
                    src: url,
                    width: "100%",
                    height: "600",
                  },
                })
                .run();
            }
          }}
        >
          <ExternalLink size={18} /> {/* hoặc icon nào bạn thích */}
        </button>
        <button
          type="button"
          className="hover:bg-gray-50 p-2 rounded-sm"
          title="Nhúng video Youtube"
          onClick={() => {
            const url = prompt("Nhập URL Youtube:");
            if (url) {
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "youtubeEmbed",
                  attrs: {
                    src: url,
                    width: "100%",
                    height: "600",
                  },
                })
                .run();
            }
          }}
        >
          <Youtube size={18} /> {/* hoặc icon nào bạn thích */}
        </button>
      </div>

      {/* Editor */}
      <Card className="focus:border-none">
        <EditorContent editor={editor} />
      </Card>
    </div>
  );
}
