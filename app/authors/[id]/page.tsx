"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import TiptapEditor from "@/components/TiptapEditor";
import ArticleCard from "@/components/ArticleCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGoogle,
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 6;

const CATEGORIES = [
  { label: "Tất cả", value: "all" },
  { label: "Dinh dưỡng", value: "dinh-duong" },
  { label: "Luyện tập", value: "luyen-tap" },
  { label: "Lối sống", value: "loi-song" },
  { label: "Khác", value: "khac" },
];

export default function AuthorPage() {
  const { id: authorId } = useParams();
  const { user, isSignedIn } = useUser();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "all";

  const [author, setAuthor] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

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

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/authors/${authorId}/articles?page=${page}&category=${category}`
      );
      const data = await res.json();
      setArticles(data.articles);
      setTotal(data.total);
      setLoading(false);
    };
    fetchArticles();
  }, [authorId, page, category]);

  if (!author) return <p className="text-center py-8">Đang tải tác giả...</p>;

  const isOwner = isSignedIn && user?.id === author?.clerkUserId;
  const socialLinks = author.socialLinks || {};

  const socialIcons = [
    {
      key: "gmail",
      icon: <FontAwesomeIcon icon={faGoogle} />,
      link: socialLinks.gmail ? `mailto:${socialLinks.gmail}` : null,
      label: socialLinks.gmail,
    },
    {
      key: "facebook",
      icon: <FontAwesomeIcon icon={faFacebook} />,
      link: socialLinks.facebook,
      label: socialLinks.facebook,
    },
    {
      key: "instagram",
      icon: <FontAwesomeIcon icon={faInstagram} />,
      link: socialLinks.instagram,
      label: socialLinks.instagram,
    },
    {
      key: "youtube",
      icon: <FontAwesomeIcon icon={faYoutube} />,
      link: socialLinks.youtube,
      label: socialLinks.youtube,
    },
    {
      key: "tiktok",
      icon: <FontAwesomeIcon icon={faTiktok} />,
      link: socialLinks.tiktok,
      label: socialLinks.tiktok,
    },
  ];

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Author Info */}
      <div className="mb-8 p-4">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">{author.name}</h2>
            {isOwner ? (
              bio ? (
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
                <div className="space-y-2 mt-2">
                  <Label htmlFor="bio" className="sr-only">
                    Giới thiệu
                  </Label>
                  <Input
                    id="bio"
                    placeholder="Hãy giới thiệu về bạn"
                    onBlur={async (e) => {
                      const newBio = e.target.value;
                      if (newBio.trim()) {
                        setBio(newBio);
                        await fetch(`/api/user/${authorId}/bio`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ bio: newBio }),
                        });
                      }
                    }}
                  />
                </div>
              )
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

        {/* Social Links */}
        <div className="mt-4 flex flex-wrap gap-4">
          {socialIcons.map(
            ({ key, icon, link, label }) =>
              link && (
                <a
                  key={key}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  {icon}
                  <span>
                    {key === "gmail"
                      ? label
                      : label
                          ?.replace(/^https?:\/\/(www\.)?/, "")
                          .split("/")[1] || label}
                  </span>
                </a>
              )
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <Link key={cat.value} href={`?category=${cat.value}&page=1`} passHref>
            <Button
              variant={category === cat.value ? "default" : "ghost"}
              size="sm"
            >
              {cat.label}
            </Button>
          </Link>
        ))}
      </div>

      {/* Articles */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {loading ? (
          <p className="text-center col-span-2">Đang tải bài viết...</p>
        ) : articles.length === 0 ? (
          <p className="text-center col-span-2">Không có bài viết nào.</p>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-12 mb-4 flex justify-center gap-2">
        <Link href={`?category=${category}&page=${page - 1}`} passHref>
          <Button variant="ghost" size="sm" disabled={page === 1}>
            ← Trước
          </Button>
        </Link>

        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNum = index + 1;
          return (
            <Link
              key={pageNum}
              href={`?category=${category}&page=${pageNum}`}
              passHref
            >
              <Button
                variant={page === pageNum ? "destructive" : "ghost"}
                size="sm"
                disabled={page === pageNum}
              >
                {pageNum}
              </Button>
            </Link>
          );
        })}

        <Link href={`?category=${category}&page=${page + 1}`} passHref>
          <Button variant="ghost" size="sm" disabled={page === totalPages}>
            Sau →
          </Button>
        </Link>
      </div>
    </div>
  );
}
