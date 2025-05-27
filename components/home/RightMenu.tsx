import React from "react";
import PopularPosts from "./PopularPosts";
import MenuCategories from "./MenuCategories";

const RightMenu = () => {
  return (
    <div>
      <h2 className="text-lg text-gray-700">Chủ đề hot</h2>
      <h1 className="text-2xl font-bold">Bài viết được yêu thích</h1>
      <PopularPosts />
      <h2 className="text-lg text-gray-700">Khám phá chủ đề</h2>
      <h1 className="text-2xl font-bold">Danh mục</h1>
      <MenuCategories />
    </div>
  );
};

export default RightMenu;
