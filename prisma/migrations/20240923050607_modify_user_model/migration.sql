/*
  Warnings:

  - You are about to drop the column `storeAddress` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `storeEmail` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `storeName` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `storePhoneNumber` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `username` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `phoneNumber` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(15)`.
  - You are about to alter the column `companyName` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `contactPerson` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `storeAddress`,
    DROP COLUMN `storeEmail`,
    DROP COLUMN `storeName`,
    DROP COLUMN `storePhoneNumber`,
    MODIFY `username` VARCHAR(50) NOT NULL,
    MODIFY `email` VARCHAR(100) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL,
    MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `phoneNumber` VARCHAR(15) NULL,
    MODIFY `companyName` VARCHAR(100) NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `contactPerson` VARCHAR(100) NULL,
    MODIFY `address` TEXT NULL,
    MODIFY `aboutUs` TEXT NULL,
    MODIFY `logo` VARCHAR(255) NULL;

-- CreateIndex
CREATE INDEX `User_username_email_idx` ON `User`(`username`, `email`);
