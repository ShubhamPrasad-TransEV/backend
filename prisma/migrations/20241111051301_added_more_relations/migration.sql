/*
  Warnings:

  - You are about to drop the column `freeProductId` on the `offer` table. All the data in the column will be lost.
  - You are about to drop the column `minQuantity` on the `offer` table. All the data in the column will be lost.
  - You are about to drop the column `targetProductId` on the `offer` table. All the data in the column will be lost.
  - The values [BUY_ONE_GET_ONE,BUY_ONE_GET_DISCOUNT,FLAT_DISCOUNT] on the enum `Offer_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `sellerId` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `offer` DROP FOREIGN KEY `Offer_freeProductId_fkey`;

-- DropForeignKey
ALTER TABLE `offer` DROP FOREIGN KEY `Offer_targetProductId_fkey`;

-- AlterTable
ALTER TABLE `offer` DROP COLUMN `freeProductId`,
    DROP COLUMN `minQuantity`,
    DROP COLUMN `targetProductId`,
    ADD COLUMN `buyCategoryId` INTEGER NULL,
    ADD COLUMN `buyProductId` VARCHAR(191) NULL,
    ADD COLUMN `buyQuantity` INTEGER NULL,
    ADD COLUMN `getCategoryId` INTEGER NULL,
    ADD COLUMN `getProductId` VARCHAR(191) NULL,
    ADD COLUMN `getQuantity` INTEGER NULL,
    ADD COLUMN `sellerId` INTEGER NOT NULL,
    MODIFY `type` ENUM('BUY_N_GET_M_FREE_PRODUCT', 'BUY_N_GET_M_FREE_CATEGORY', 'BUY_N_GET_M_DISCOUNT_PRODUCT', 'BUY_N_GET_M_DISCOUNT_CATEGORY', 'FLAT_DISCOUNT_PRODUCT', 'FLAT_DISCOUNT_CATEGORY', 'SIMPLE_FLAT_DISCOUNT') NOT NULL;

-- CreateIndex
CREATE INDEX `Offer_sellerId_idx` ON `Offer`(`sellerId`);

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_buyProductId_fkey` FOREIGN KEY (`buyProductId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_buyCategoryId_fkey` FOREIGN KEY (`buyCategoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_getProductId_fkey` FOREIGN KEY (`getProductId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_getCategoryId_fkey` FOREIGN KEY (`getCategoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
