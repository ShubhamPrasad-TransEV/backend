/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `OperationalSettings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `OperationalSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `operationalsettings` ADD COLUMN `adminId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `OperationalSettings_adminId_key` ON `OperationalSettings`(`adminId`);

-- AddForeignKey
ALTER TABLE `OperationalSettings` ADD CONSTRAINT `OperationalSettings_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admins`(`adminId`) ON DELETE CASCADE ON UPDATE CASCADE;
