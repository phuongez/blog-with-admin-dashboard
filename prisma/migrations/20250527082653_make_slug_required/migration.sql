/*
  Warnings:

  - Made the column `slug` on table `Articles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Articles" ALTER COLUMN "slug" SET NOT NULL;
