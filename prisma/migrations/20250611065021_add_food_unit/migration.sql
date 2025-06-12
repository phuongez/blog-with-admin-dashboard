/*
  Warnings:

  - Added the required column `group` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "group" TEXT NOT NULL,
ADD COLUMN     "unit" TEXT NOT NULL,
ALTER COLUMN "calories" DROP NOT NULL;
