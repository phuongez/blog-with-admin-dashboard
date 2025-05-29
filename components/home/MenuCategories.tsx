import Link from "next/link";
import React from "react";

const MenuCategories = () => {
  return (
    <div className="flex md:flex-col lg:flex-row lg:flex-wrap mt-8 gap-4">
      <Link
        href="/articles?category=dinhduong"
        className="bg-primary hover:bg-primary/90 text-white w-[8rem] px-4 py-2 rounded-md flex items-center justify-center"
      >
        Dinh dưỡng
      </Link>
      <Link
        href="/articles?category=luyentap"
        className="bg-primary hover:bg-primary/90 text-white w-[8rem] px-4 py-2 rounded-md flex items-center justify-center"
      >
        Luyện tập
      </Link>
      <Link
        href="/articles?category=loisong"
        className="bg-primary hover:bg-primary/90 text-white w-[8rem] px-4 py-2 rounded-md flex items-center justify-center"
      >
        Lối sống
      </Link>
      <Link
        href="/articles?category=khac"
        className="bg-primary hover:bg-primary/90 text-white w-[8rem] px-4 py-2 rounded-md flex items-center justify-center"
      >
        Khác
      </Link>
    </div>
  );
};

export default MenuCategories;
