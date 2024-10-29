/*
  Warnings:

  - A unique constraint covering the columns `[productid]` on the table `MostlySearched` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `mostlyViewed` (
    `productId` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `mostlyViewed_productId_key`(`productId`),
    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `MostlySearched_productid_key` ON `MostlySearched`(`productid`);

-- AddForeignKey
ALTER TABLE `mostlyViewed` ADD CONSTRAINT `mostlyViewed_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
