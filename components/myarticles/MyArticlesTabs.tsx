"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllSavedArticles } from "./AllSavedArticles";
import { AllPurchasedArticles } from "./AllPurchasedArticles";

export function MyArticlesTabs({ saved, purchased }: any) {
  return (
    <Tabs defaultValue="saved" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="saved">Đã lưu</TabsTrigger>
        <TabsTrigger value="purchased">Đã mua</TabsTrigger>
      </TabsList>

      <TabsContent value="saved">
        <AllSavedArticles articles={saved.articles} />
        {saved.pagination}
      </TabsContent>

      <TabsContent value="purchased">
        <AllPurchasedArticles articles={purchased.articles} />
        {purchased.pagination}
      </TabsContent>
    </Tabs>
  );
}
