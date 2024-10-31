-- CreateTable
CREATE TABLE `MostlyWishlist` (
    `productId` VARCHAR(191) NOT NULL,
    `mostwish` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `MostlyWishlist_productId_key`(`productId`),
    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MostlyWishlist` ADD CONSTRAINT `MostlyWishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
