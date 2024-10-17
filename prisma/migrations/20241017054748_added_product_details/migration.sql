/*
  Warnings:

  - Added the required column `productDetails` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `productDetails` JSON NOT NULL;
