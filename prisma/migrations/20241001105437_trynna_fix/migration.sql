-- AlterTable
ALTER TABLE `order` ADD COLUMN `invoice` VARCHAR(191) NULL,
    ADD COLUMN `orderFulfillmentStatus` VARCHAR(191) NOT NULL DEFAULT 'Unfulfilled',
    ADD COLUMN `orderingStatus` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    ADD COLUMN `paymentStatus` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `prePayment` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `refundStatus` VARCHAR(191) NOT NULL DEFAULT 'No Refund',
    ADD COLUMN `sellerId` INTEGER NULL,
    ADD COLUMN `shipmentStatus` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    ADD COLUMN `shippingCost` DOUBLE NOT NULL DEFAULT 0.0;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_userId_fkey` TO `Order_userId_idx`;
