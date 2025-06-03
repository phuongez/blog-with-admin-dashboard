"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import "react-quill-new/dist/quill.snow.css";
// import dynamic from "next/dynamic";
import dynamic from "next/dynamic";
const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
});
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export function CreateArticlePage() {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const clerkUserId = user?.id; // 👈 Đây là ID Clerk, không phải authorId trong DB

  const uploadImageToCloudinary = async (
    file: File
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload"); // 👉 Cập nhật đúng preset

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ds30pv4oa/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url ?? null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const subtitle = formData.get("subtitle") as string;
    const category = formData.get("category") as string;
    const isPaid = formData.get("isPaid") as string;
    const showToc = formData.get("showToc") === "on";

    if (!imageFile) {
      setErrors({ featuredImage: ["Vui lòng chọn ảnh đại diện"] });
      setLoading(false);
      return;
    }

    const imageUrl = await uploadImageToCloudinary(imageFile);
    if (!imageUrl) {
      setErrors({ featuredImage: ["Upload ảnh thất bại"] });
      setLoading(false);
      return;
    }

    const res = await fetch("/api/articles/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug,
        subtitle,
        category,
        isPaid,
        content,
        imageUrl,
        showToc,
        clerkUserId: clerkUserId,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setErrors({ formErrors: [result.error || "Đã có lỗi xảy ra"] });
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  const modules = { toolbar: { container: "#toolbar" } };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tạo bài viết mới</CardTitle>
        </CardHeader>
        <CardContent className="relative mt-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tiêu đề */}
            <Label htmlFor="title" className="w-[10rem] sr-only">
              Tiêu đề bài viết
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Tiêu đề bài viết"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-bold md:text-2xl placeholder:text-gray-400"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}

            {/* Slug */}
            <Label htmlFor="slug" className="w-[10rem] sr-only">
              Đường dẫn rút gọn
            </Label>
            <Input
              id="slug"
              name="slug"
              placeholder="Đường dẫn rút gọn..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none md:text-lg placeholder:text-gray-400"
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug}</p>
            )}

            {/* Phụ đề */}
            <Label htmlFor="subtitle" className="w-[10rem] sr-only">
              Tiêu đề phụ
            </Label>
            <textarea
              name="subtitle"
              placeholder="Tiêu đề phụ..."
              className="px-3 w-full resize-none overflow-hidden border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none md:text-lg placeholder:text-gray-400"
            />

            {/* Danh mục */}
            <div className="flex px-3 items-center gap-3">
              <Label htmlFor="category" className="w-[10rem]">
                Danh mục
              </Label>
              <select
                name="category"
                defaultValue="khac"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Chọn danh mục</option>
                <option value="dinhduong">Dinh dưỡng</option>
                <option value="luyentap">Luyện tập</option>
                <option value="loisong">Lối sống</option>
                <option value="khac">Khác</option>
              </select>
            </div>

            {/* Loại bài viết */}
            <div className="flex px-3 items-center gap-3">
              <Label htmlFor="isPaid" className="w-[10rem]">
                Loại bài viết
              </Label>
              <select
                name="isPaid"
                defaultValue="free"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Chọn loại bài viết</option>
                <option value="paid">Trả phí</option>
                <option value="free">Miễn phí</option>
              </select>
            </div>

            {/* Ảnh đại diện */}
            <div className="flex px-3 items-center justify-between gap-3">
              <Label htmlFor="featuredImage" className="w-[10rem]">
                Ảnh đại diện
              </Label>
              <Input
                id="featuredImage"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
              {errors.featuredImage && (
                <p className="text-sm text-red-500">{errors.featuredImage}</p>
              )}
            </div>
            {/* Table of contents */}
            <div className="flex items-center gap-2 px-3">
              <input
                type="checkbox"
                id="showToc"
                name="showToc"
                className="w-4 h-4"
              />
              <label htmlFor="showToc" className="text-sm">
                Hiển thị mục lục (Table of Contents)
              </label>
            </div>

            {/* Nội dung */}
            <div className="space-y-2 relative mt-6 w-full">
              <Label className="sr-only" htmlFor="content">
                Nội dung bài viết
              </Label>
              <TiptapEditor content={content} onChange={setContent} />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            {errors.formErrors && (
              <div className="bg-red-100 p-2 border border-red-600">
                <p className="text-sm text-red-500">{errors.formErrors}</p>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang đăng..." : "Đăng bài viết"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
