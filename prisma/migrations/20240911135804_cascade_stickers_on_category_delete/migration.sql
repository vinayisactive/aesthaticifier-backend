-- DropForeignKey
ALTER TABLE "Stickers" DROP CONSTRAINT "Stickers_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Stickers" ADD CONSTRAINT "Stickers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
