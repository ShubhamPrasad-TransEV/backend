-- DropForeignKey
ALTER TABLE `adminsettings` DROP FOREIGN KEY `AdminSettings_adminId_fkey`;

-- AddForeignKey
ALTER TABLE `AdminSettings` ADD CONSTRAINT `AdminSettings_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admins`(`adminId`) ON DELETE CASCADE ON UPDATE CASCADE;
