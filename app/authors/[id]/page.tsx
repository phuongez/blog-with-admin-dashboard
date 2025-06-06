"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import TiptapEditor from "@/components/TiptapEditor";
import ArticleCard from "@/components/ArticleCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 6;

export default function AuthorPage() {
  const { id: authorId } = useParams();
  const { user } = useUser();

  const [author, setAuthor] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const isOwner = user?.id === author?.clerkUserId;

  // Fetch author info
  useEffect(() => {
    const fetchAuthorInfo = async () => {
      const res = await fetch(`/api/user/${authorId}`);
      const data = await res.json();
      setAuthor(data);
      setBio(data.bio || "");
    };
    fetchAuthorInfo();
  }, [authorId]);

  // Fetch articles by page
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const res = await fetch(`/api/authors/${authorId}/articles?page=${page}`);
      const data = await res.json();
      setArticles(data.articles);
      setTotal(data.total);
      setLoading(false);
    };
    fetchArticles();
  }, [authorId, page]);

  if (!author) return <p className="text-center py-8">Đang tải tác giả...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Author Info */}
      <div className="mb-8 p-4">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">{author.name}</h2>
            {isOwner ? (
              <TiptapEditor
                content={bio}
                onChange={async (updatedBio) => {
                  setBio(updatedBio);
                  await fetch(`/api/user/${authorId}/bio`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bio: updatedBio }),
                  });
                }}
              />
            ) : (
              <div
                className="prose dark:prose-invert mt-2"
                dangerouslySetInnerHTML={{ __html: bio }}
              />
            )}
          </div>
          <Avatar className="w-[66px] h-[66px] md:w-[88px] md:h-[88px]">
            <AvatarImage src={author.imageUrl as string} />
            <AvatarFallback>{author.name}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Articles */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4">
        <Button
          disabled={page === 1}
          size="sm"
          variant="ghost"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          ← Trước
        </Button>
        <span className="px-3 py-1 rounded">{page}</span>
        <Button
          disabled={page * PAGE_SIZE >= total}
          size="sm"
          variant="ghost"
          onClick={() => setPage((p) => p + 1)}
        >
          Sau →
        </Button>
      </div>
    </div>
  );
}
