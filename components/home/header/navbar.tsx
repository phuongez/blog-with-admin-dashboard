"use client";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../../dark-mode";
import Link from "next/link";
import { SignedOut, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { SignedIn, UserButton } from "@clerk/nextjs";
import SearchInput from "./search-input";
import NotificationBell from "./NotificationBell";
import { FileHeart, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex grow h-16 items-center justify-between">
          {/* Left Section - Logo & Desktop Navigation */}
          <div className="flex grow items-center justify-between sm:gap-8 ">
            {/* Logo */}
            <Link href="/" className="flex flex-1 items-center space-x-2">
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Nutrition
                </span>
                <span className="text-foreground">Blog</span>
              </span>
            </Link>
            {/* Search Bar (Desktop) */}
            <div className="hidden md:block flex-1">
              <Suspense fallback={<div>Đang tải tìm kiếm...</div>}>
                <SearchInput />
              </Suspense>
            </div>

            {/* Right Section - Search & Actions */}
            <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
              {/* Theme Toggle */}
              <ModeToggle />
              {(userRole === "ADMIN" || userRole === "AUTHOR") && (
                <Link href="/dashboard">
                  <Button className="hidden sm:block">Dashboard</Button>
                  <Button className="sm:hidden">
                    <LayoutDashboard />
                  </Button>
                </Link>
              )}

              {userRole === "USER" && (
                <Link href={"/myarticles"}>
                  <Button className="hidden sm:block">My Articles</Button>
                  <Button className="sm:hidden">
                    <FileHeart />
                  </Button>
                </Link>
              )}

              {/* User Actions */}
              <SignedIn>
                <div className="flex items-center gap-4">
                  <NotificationBell />
                </div>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <Button variant="outline">Đăng nhập</Button>
                  </SignInButton>
                  <div className="hidden md:block">
                    <SignUpButton mode="modal">
                      <Button>Đăng kí</Button>
                    </SignUpButton>
                  </div>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
