"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGoogle,
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import MiniArticleCard from "@/components/MiniArticleCard";

const PAGE_SIZE = 5;

export default function AuthorsPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [authors, setAuthors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      const res = await fetch(`/api/authors?page=${page}&limit=${PAGE_SIZE}`);
      const data = await res.json();
      setAuthors(data.authors);
      setTotal(data.total);
      setLoading(false);
    };
    fetchAuthors();
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tác giả</h1>

      {loading ? (
        <p>Đang tải tác giả...</p>
      ) : (
        <div className="space-y-10">
          {authors.map((author) => {
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

            return (
              <div key={author.id}>
                {/* Info */}
                <div className="flex items-center gap-4 mb-3">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={author.imageUrl || ""} />
                    <AvatarFallback>{author.name}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/authors/${author.id}`}>
                      <h2 className="text-xl font-semibold hover:underline">
                        {author.name}
                      </h2>
                    </Link>
                    {author.bio && (
                      <div
                        className="prose dark:prose-invert mt-1 text-sm"
                        dangerouslySetInnerHTML={{ __html: author.bio }}
                      />
                    )}
                    <div className="flex gap-3 mt-2 flex-wrap">
                      {socialIcons.map(
                        ({ key, icon, link, label }) =>
                          link && (
                            <a
                              key={key}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-primary hover:underline"
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
                </div>

                {/* Featured Articles */}
                <h1 className="text-2xl font-bold mt-4">Bài viết nổi bật</h1>
                <div className="flex overflow-x-scroll gap-4 pt-4">
                  {author.articles.slice(0, 3).map((article: any) => (
                    <MiniArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          <Link href={`?page=${page - 1}`}>
            <Button variant="ghost" size="sm" disabled={page === 1}>
              ← Trước
            </Button>
          </Link>
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <Link key={pageNum} href={`?page=${pageNum}`}>
                <Button
                  variant={pageNum === page ? "destructive" : "ghost"}
                  size="sm"
                >
                  {pageNum}
                </Button>
              </Link>
            );
          })}
          <Link href={`?page=${page + 1}`}>
            <Button variant="ghost" size="sm" disabled={page === totalPages}>
              Sau →
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
