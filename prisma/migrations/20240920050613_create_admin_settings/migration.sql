/*
  Warnings:

  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `AdminSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `siteName` VARCHAR(191) NOT NULL,
    `siteLogo` VARCHAR(191) NOT NULL,
    `siteAddress` VARCHAR(191) NOT NULL,
    `siteEmail` VARCHAR(191) NOT NULL,
    `storePhone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
