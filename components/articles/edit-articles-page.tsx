"use client";
import { FormEvent, startTransition, useActionState, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Articles } from "@prisma/client";
import { updateArticles } from "@/actions/update-article";
import Image from "next/image";

type EditPropsPage = {
  article: Articles;
};
const EditArticlePage: React.FC<EditPropsPage> = ({ article }) => {
  const [content, setContent] = useState(article.content);
  const [formState, action, isPending] = useActionState(
    updateArticles.bind(null, article.id),
    { errors: {} }
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.append("content", content);

    // Wrap the action call in startTransition
    startTransition(() => {
      action(formData);
    });
  };

  //   Quill settings
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"], // 👈 quote ở đây
      ["link", "image"], // 👈 image ở đây
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
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
    "bullet",
    "link",
    "image", // 👈 image
    "align",
    "color",
    "background",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={article.title}
                placeholder="Enter article title"
                required
              />
              {formState.errors.title && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.title}
                </span>
              )}
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image</Label>
              {article.featuredImage && (
                <div className="mb-4">
                  <Image
                    src={article.featuredImage}
                    alt="Current featured"
                    width={192}
                    height={128}
                    className="object-cover rounded-md"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Current featured image
                  </p>
                </div>
              )}
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
            <div className="space-y-2">
              <Label>Content</Label>
              <ReactQuill
                theme="snow"
                // defaultValue={}
                modules={modules}
                formats={formats}
                value={content}
                onChange={setContent}
              />
              {formState.errors.content && (
                <span className="font-medium text-sm text-red-500">
                  {formState.errors.content[0]}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline">
                Discard Changes
              </Button>
              <Button disabled={isPending} type="submit">
                {isPending ? "Loading..." : "Update Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default EditArticlePage;
