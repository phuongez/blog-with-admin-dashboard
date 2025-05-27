-- CreateTable
CREATE TABLE "ArticlePurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticlePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticlePurchase_userId_articleId_key" ON "ArticlePurchase"("userId", "articleId");

-- AddForeignKey
ALTER TABLE "ArticlePurchase" ADD CONSTRAINT "ArticlePurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticlePurchase" ADD CONSTRAINT "ArticlePurchase_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
