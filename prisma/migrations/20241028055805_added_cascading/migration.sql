-- DropForeignKey
ALTER TABLE `seller` DROP FOREIGN KEY `Seller_id_fkey`;

-- AddForeignKey
ALTER TABLE `Seller` ADD CONSTRAINT `Seller_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
