"use client";
import { FormEvent, startTransition, useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import "react-quill-new/dist/quill.snow.css";
import { createArticles } from "@/actions/create-article";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export function CreateArticlePage() {
  const [content, setContent] = useState("");

  const [formState, action, isPending] = useActionState(createArticles, {
    errors: {},
  });

  //   Quill settings
  const modules = {
    toolbar: {
      container: "#toolbar",
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote", // 👈 quote
    "code-block",
    "list",
    "link",
    "image", // 👈 image
    "align",
    "color",
    "background",
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.append("content", content);

    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tạo bài viết mới</CardTitle>
        </CardHeader>
        <CardContent className="relative mt-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="sr-only">
                Tiêu đề bài viết
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Tiêu đề bài viết"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-bold md:text-2xl placeholder:text-gray-400"
              />
              {formState.errors.title && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.title}
                </span>
              )}
            </div>
            <textarea
              id="subtitle"
              name="subtitle"
              placeholder="Tiêu đề phụ..."
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              className="px-3 w-full resize-none overflow-hidden border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none md:text-lg placeholder:text-gray-400"
            />

            <div className="flex px-3 items-center gap-3">
              <Label htmlFor="category" className="w-[10rem]">
                Danh mục
              </Label>
              <select
                id="category"
                name="category"
                defaultValue="khac"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Chọn danh mục bài viết</option>
                <option value="dinhduong">Dinh dưỡng</option>
                <option value="luyentap">Luyện tập</option>
                <option value="loisong">Lối sống</option>
                <option value="khac">Khác</option>
              </select>
              {formState.errors.category && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.category}
                </span>
              )}
            </div>

            <div className="flex px-3 items-center justify-between gap-3">
              <Label htmlFor="featuredImage" className="w-[10rem]">
                Ảnh đại diện
              </Label>
              <Input
                id="featuredImage"
                name="featuredImage"
                type="file"
                accept="image/*"
              />
              {formState.errors.featuredImage && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.featuredImage}
                </span>
              )}
            </div>

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
              {/* Ô nhập nội dung, có margin top tránh che */}
              <div className="mt-[90px]">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Viết nội dung bài viết ở đây..."
                  className="no-border"
                />
                {formState.errors.content && (
                  <span className="font-medium text-sm text-red-500">
                    {formState.errors.content[0]}
                  </span>
                )}
              </div>
            </div>

            {formState.errors.formErrors && (
              <div className="dark:bg-transparent bg-red-100 p-2 border border-red-600">
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.formErrors}
                </span>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? "Loading..." : "Publish Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
