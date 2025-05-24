"use client";

import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListNode, ListItemNode } from "@lexical/list";

const theme = {
  paragraph: "mb-2",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};

const editorConfig = {
  namespace: "my-editor", // 👈 Bắt buộc
  theme: {
    paragraph: "editor-paragraph",
    text: {
      bold: "editor-bold",
      italic: "editor-italic",
      underline: "editor-underline",
    },
  },
  onError(error: Error) {
    console.error("Lexical error:", error);
  },
  nodes: [ListNode, ListItemNode],
};

const Editor = () => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="border p-2 rounded">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[150px] outline-none" />
          }
          placeholder={<div className="text-gray-400">Nhập nội dung...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const json = editorState.toJSON();
              console.log("Editor State:", json);
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
};

export default Editor;
