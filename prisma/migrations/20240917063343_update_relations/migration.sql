/*
  Warnings:

  - You are about to drop the column `aboutUs` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `storeAddress` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `storeEmail` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `storeName` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `storePhoneNumber` on the `seller` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_roleId_fkey`;

-- AlterTable
ALTER TABLE `seller` DROP COLUMN `aboutUs`,
    DROP COLUMN `logo`,
    DROP COLUMN `storeAddress`,
    DROP COLUMN `storeEmail`,
    DROP COLUMN `storeName`,
    DROP COLUMN `storePhoneNumber`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `aboutUs` VARCHAR(191) NULL,
    ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `storeAddress` VARCHAR(191) NULL,
    ADD COLUMN `storeEmail` VARCHAR(191) NULL,
    ADD COLUMN `storeName` VARCHAR(191) NULL,
    ADD COLUMN `storePhoneNumber` VARCHAR(191) NULL,
    MODIFY `roleId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
