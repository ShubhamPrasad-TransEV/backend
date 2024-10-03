-- AlterTable
ALTER TABLE `category` ADD COLUMN `subcategoryId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Category_subcategoryId_idx` ON `Category`(`subcategoryId`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
