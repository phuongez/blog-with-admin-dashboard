"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

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
    const subtitle = formData.get("subtitle") as string;
    const category = formData.get("category") as string;
    const isPaid = formData.get("isPaid") as string;

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
        subtitle,
        category,
        isPaid,
        content,
        imageUrl,
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
            <Input
              id="title"
              name="title"
              placeholder="Tiêu đề bài viết"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-bold md:text-2xl placeholder:text-gray-400"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}

            {/* Phụ đề */}
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

            {/* Nội dung */}
            <div className="space-y-2 relative">
              {/* Thanh công cụ cố định */}
              <div
                id="toolbar"
                className="fixed top-16 left-0 right-0 z-50 bg-white p-2 border-none flex flex-wrap justify-start overflow-x-auto w-full max-w-full sm:justify-center sm:overflow-visible"
              >
                <select className="ql-header" defaultValue="">
                  <option value="1" />
                  <option value="2" />
                  <option value="3" />
                  <option value="" />
                </select>
                <button className="ql-bold" />
                <button className="ql-italic" />
                <button className="ql-underline" />
                <button className="ql-strike" />
                <button className="ql-list" value="ordered" />
                <button className="ql-list" value="bullet" />
                <button className="ql-blockquote" />
                <button className="ql-code-block" />
                <button className="ql-link" />
                <button className="ql-image" />
                <select className="ql-align" />
                <select className="ql-color" />
                <select className="ql-background" />
                <button className="ql-clean" />
              </div>
              <div className="mt-[90px]">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  className="no-border"
                  placeholder="Viết nội dung bài viết ở đây..."
                />
                {errors.content && (
                  <p className="text-sm text-red-500">{errors.content}</p>
                )}
              </div>
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
