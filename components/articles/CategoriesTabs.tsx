"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";

const categories = [
  { label: "Tất cả", value: "" },
  { label: "Dinh dưỡng", value: "dinhduong" },
  { label: "Luyện tập", value: "luyentap" },
  { label: "Lối sống", value: "loisong" },
  { label: "Khác", value: "khac" },
];

export default function CategoriesTabs() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  return (
    <div className="flex flex-wrap gap-4 px-4 md:px-24 py-8 mx-auto justify-center text-sm md:text-base">
      {categories.map((cat) => {
        const isActive = currentCategory === cat.value;
        const href = cat.value
          ? `/articles?category=${cat.value}`
          : "/articles";

        return (
          <Link
            key={cat.value}
            href={href}
            className={clsx("w-fit px-4 py-2 rounded-md transition-colors", {
              "bg-black text-white": isActive,
              "bg-gray-100 hover:bg-gray-200 text-black": !isActive,
            })}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
