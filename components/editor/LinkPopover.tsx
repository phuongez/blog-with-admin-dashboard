"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState, useEffect } from "react";
import { Link as LinkIcon } from "lucide-react";

type Props = {
  selectedText: string;
  onSubmit: (url: string) => void;
};

export default function LinkPopover({ selectedText, onSubmit }: Props) {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (url.trim()) {
      onSubmit(url.trim());
      setUrl("");
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      setUrl("");
    }
  }, [open]);

  return (
    <div>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className="hover:bg-gray-100 p-2 rounded-sm"
            title="Chèn liên kết"
          >
            <LinkIcon size={18} />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side="top"
            align="start"
            className="rounded-md shadow-lg bg-white p-4 w-[280px] z-50 border"
          >
            <h4 className="font-semibold text-sm mb-2">Tạo một liên kết</h4>

            {/* Input hiển thị đoạn text đang chọn */}
            <input
              type="text"
              readOnly
              value={selectedText || "Không có lựa chọn"}
              className="w-full px-3 py-2 border rounded-md text-sm mb-3 bg-gray-100 text-gray-700"
            />

            {/* Nhập URL */}
            <input
              type="text"
              placeholder="Nhập đường dẫn..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm mb-3 outline-none focus:ring"
            />

            <div className="flex justify-end gap-2 text-sm">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-3 py-1 rounded-md bg-black text-white hover:bg-gray-800"
              >
                Link
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
