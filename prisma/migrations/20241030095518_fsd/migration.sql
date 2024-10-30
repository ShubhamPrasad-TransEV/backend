-- DropForeignKey
ALTER TABLE `cartitem` DROP FOREIGN KEY `CartItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_productId_fkey`;

-- AlterTable
ALTER TABLE `adminsettings` MODIFY `siteName` VARCHAR(255) NULL,
    MODIFY `siteLogo` VARCHAR(255) NULL,
    MODIFY `siteAddress` VARCHAR(255) NULL,
    MODIFY `siteEmail` VARCHAR(255) NULL,
    MODIFY `storePhone` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `cartitem` MODIFY `productId` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `category` MODIFY `name` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `image` MODIFY `filename` VARCHAR(255) NULL,
    MODIFY `path` VARCHAR(255) NULL,
    MODIFY `productId` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `notification` MODIFY `message` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `operationalsettings` MODIFY `timeZone` VARCHAR(255) NULL,
    MODIFY `currency` VARCHAR(255) NULL,
    MODIFY `taxRate` DOUBLE NULL,
    MODIFY `freeShippingThreshold` DOUBLE NULL,
    MODIFY `orderProcessingTime` INTEGER NULL,
    MODIFY `minimumOrderAmount` DOUBLE NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `orderedItems` JSON NULL,
    MODIFY `shipmentStatus` VARCHAR(191) NULL DEFAULT 'Pending',
    MODIFY `refundStatus` VARCHAR(191) NULL DEFAULT 'No Refund',
    MODIFY `shippingCost` DOUBLE NULL DEFAULT 0.0,
    MODIFY `totalOrderCost` DOUBLE NULL DEFAULT 0.0,
    MODIFY `totalItemCost` DOUBLE NULL DEFAULT 0.0,
    MODIFY `orderingStatus` VARCHAR(191) NULL DEFAULT 'Pending',
    MODIFY `orderFulfillmentStatus` VARCHAR(191) NULL DEFAULT 'Unfulfilled';

-- AlterTable
ALTER TABLE `passwordreset` MODIFY `otp` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `name` VARCHAR(255) NULL,
    MODIFY `price` DOUBLE NULL,
    MODIFY `productDetails` JSON NULL,
    MODIFY `quantity` INTEGER NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `role` MODIFY `name` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `seller` MODIFY `aboutUs` VARCHAR(255) NULL,
    MODIFY `logo` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `store` MODIFY `name` VARCHAR(255) NULL,
    MODIFY `logo` VARCHAR(255) NULL,
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `email` VARCHAR(255) NULL,
    MODIFY `phoneNumber` VARCHAR(255) NULL,
    MODIFY `aboutUs` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `name` VARCHAR(255) NULL,
    MODIFY `username` VARCHAR(255) NULL,
    MODIFY `email` VARCHAR(255) NULL,
    MODIFY `password` VARCHAR(255) NULL,
    MODIFY `phoneNumber` VARCHAR(20) NULL,
    MODIFY `companyName` VARCHAR(255) NULL,
    MODIFY `contactPerson` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
