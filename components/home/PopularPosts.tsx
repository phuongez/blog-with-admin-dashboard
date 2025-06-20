import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./popularPosts.module.css";
import { prisma } from "@/lib/prisma";

const MenuPost = async () => {
  const articles = await prisma.articles.findMany({
    include: {
      _count: {
        select: { likes: true },
      },
      author: true,
    },
  });

  const sortedArticles = articles.sort(
    (a, b) => b._count.likes - a._count.likes
  );

  function slugToCategory(slug: string): string {
    const map: Record<string, string> = {
      dinhduong: "Dinh dưỡng",
      luyentap: "Luyện tập",
      loisong: "Lối sống",
      khac: "Khác",
    };

    return map[slug] ?? slug;
  }

  return (
    <div className={styles.items}>
      {sortedArticles.slice(0, 5).map((article) => (
        <Link
          key={article.id}
          className={styles.item}
          href={`/articles/${article.slug}`}
        >
          <div className={styles.imageContainer}>
            <Image
              src={article.featuredImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.image}
            />
          </div>

          <div className={styles.textContainer}>
            <span className="text-sm text-primary w-fit font-bold">
              {slugToCategory(article.category)}
            </span>
            <h3 className={styles.postTitle}>{article.title}</h3>
            <div className={styles.detail}>
              <span className={styles.username}>{article.author.name}</span>
              <span className={styles.date}>
                {" "}
                -{" "}
                {new Date(article.createdAt).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPost;
