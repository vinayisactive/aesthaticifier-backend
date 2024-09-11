/*
  Warnings:

  - You are about to drop the column `category` on the `Stickers` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Stickers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stickers" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stickers" ADD CONSTRAINT "Stickers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
