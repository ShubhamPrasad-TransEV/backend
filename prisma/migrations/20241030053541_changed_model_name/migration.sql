/*
  Warnings:

  - You are about to drop the `mostlywishlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `mostlywishlist` DROP FOREIGN KEY `MostlyWishlist_productId_fkey`;

-- DropTable
DROP TABLE `mostlywishlist`;

-- CreateTable
CREATE TABLE `mostlyWishlisted` (
    `productId` VARCHAR(191) NOT NULL,
    `numberOfTimesWishlisted` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `mostlyWishlisted_productId_key`(`productId`),
    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mostlyWishlisted` ADD CONSTRAINT `mostlyWishlisted_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
