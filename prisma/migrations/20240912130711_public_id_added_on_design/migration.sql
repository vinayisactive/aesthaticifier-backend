/*
  Warnings:

  - Added the required column `publicId` to the `DesignAssets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DesignAssets" ADD COLUMN     "publicId" TEXT NOT NULL;
