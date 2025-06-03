/*
  Warnings:

  - Added the required column `priceAtPurchase` to the `ArticlePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `articleId` to the `TransactionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TransactionLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArticlePurchase" ADD COLUMN     "priceAtPurchase" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TransactionLog" ADD COLUMN     "articleId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TransactionLog" ADD CONSTRAINT "TransactionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionLog" ADD CONSTRAINT "TransactionLog_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
