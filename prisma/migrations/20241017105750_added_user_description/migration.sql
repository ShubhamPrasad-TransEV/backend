-- AlterTable
ALTER TABLE `user` ADD COLUMN `description` VARCHAR(191) NULL;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `Product_sellerId_fkey` TO `Product_sellerId_idx`;
