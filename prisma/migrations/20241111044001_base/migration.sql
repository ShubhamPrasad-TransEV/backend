-- CreateTable
CREATE TABLE `Offer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('BUY_ONE_GET_ONE', 'BUY_ONE_GET_DISCOUNT', 'FLAT_DISCOUNT') NOT NULL,
    `discount` DOUBLE NULL,
    `minQuantity` INTEGER NULL,
    `targetProductId` VARCHAR(191) NOT NULL,
    `freeProductId` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `validFrom` DATETIME(3) NOT NULL,
    `validUntil` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_targetProductId_fkey` FOREIGN KEY (`targetProductId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_freeProductId_fkey` FOREIGN KEY (`freeProductId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
