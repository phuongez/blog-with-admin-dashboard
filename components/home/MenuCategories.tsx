import Link from "next/link";
import React from "react";
import styles from "./menuCategories.module.css";

const MenuCategories = () => {
  return (
    <div className={styles.categoryList}>
      <Link
        href="/articles?cat=dinhduong"
        className="bg-primary hover:bg-primary/90 text-white w-fit px-4 py-2 rounded-full"
      >
        Dinh dưỡng
      </Link>
      <Link
        href="/articles?cat=luỵentap"
        className="bg-primary hover:bg-primary/90 text-white w-fit px-4 py-2 rounded-full"
      >
        Luyện tập
      </Link>
      <Link
        href="/articles?cat=loisong"
        className="bg-primary hover:bg-primary/90 text-white w-fit px-4 py-2 rounded-full"
      >
        Lối sống
      </Link>
      <Link
        href="/articles?cat=khac"
        className="bg-primary hover:bg-primary/90 text-white w-fit px-4 py-2 rounded-full"
      >
        Khác
      </Link>
    </div>
  );
};

export default MenuCategories;
