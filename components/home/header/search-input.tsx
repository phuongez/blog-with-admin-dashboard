"use client";
import { searchAction } from "@/actions/search";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const SearchInput = () => {
  const params = useSearchParams();

  return (
    <form className="w-full" action={searchAction}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="search"
          defaultValue={params.get("search") || ""}
          placeholder="Tìm bài viết..."
          className="pl-10 w-48 focus-visible:ring-1 w-full"
        />
      </div>
    </form>
  );
};

export default SearchInput;
