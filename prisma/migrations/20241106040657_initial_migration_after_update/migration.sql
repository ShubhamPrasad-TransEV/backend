-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `username` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `phoneNumber` VARCHAR(20) NULL,
    `isSeller` BOOLEAN NOT NULL DEFAULT false,
    `companyName` VARCHAR(255) NULL,
    `contactPerson` VARCHAR(255) NULL,
    `address` TEXT NULL,
    `roleId` INTEGER NULL DEFAULT 2,
    `aboutUs` TEXT NULL,
    `logo` VARCHAR(255) NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_username_email_idx`(`username`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aboutUs` VARCHAR(255) NULL,
    `logo` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,

    UNIQUE INDEX `Admins_adminId_key`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NULL,
    `price` DOUBLE NULL,
    `sellerId` INTEGER NOT NULL,
    `productDetails` JSON NOT NULL,
    `quantity` INTEGER NULL DEFAULT 1,

    INDEX `Product_sellerId_idx`(`sellerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quantitymanagement` (
    `id` VARCHAR(191) NOT NULL,
    `currentquantity` INTEGER NULL,
    `afterupdatequantity` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unit` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Unit_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `orderedItems` JSON NULL,
    `shipmentCompany` VARCHAR(191) NULL,
    `shipmentRequestStatus` VARCHAR(191) NULL,
    `shipmentStatus` VARCHAR(191) NULL DEFAULT 'Pending',
    `invoice` VARCHAR(191) NULL,
    `refundStatus` VARCHAR(191) NULL DEFAULT 'No Refund',
    `refundDetails` VARCHAR(191) NULL,
    `shippingCost` DOUBLE NULL DEFAULT 0.0,
    `totalOrderCost` DOUBLE NULL DEFAULT 0.0,
    `totalItemCost` DOUBLE NULL DEFAULT 0.0,
    `orderingStatus` VARCHAR(191) NULL DEFAULT 'Pending',
    `orderFulfillmentStatus` VARCHAR(191) NULL DEFAULT 'Unfulfilled',
    `prePayment` BOOLEAN NOT NULL DEFAULT false,
    `paymentStatus` BOOLEAN NOT NULL DEFAULT false,
    `sellerId` INTEGER NULL,
    `orderedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orderFulfilledAt` DATETIME(3) NULL,

    INDEX `Order_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(255) NULL,
    `path` VARCHAR(255) NULL,
    `productId` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `productId` VARCHAR(255) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordReset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `otp` VARCHAR(255) NULL,
    `userId` INTEGER NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `PasswordReset_otp_idx`(`otp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `message` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `read` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Store` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `logo` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `phoneNumber` VARCHAR(255) NULL,
    `aboutUs` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Store_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `siteName` VARCHAR(255) NULL,
    `siteLogo` VARCHAR(255) NULL,
    `siteAddress` VARCHAR(255) NULL,
    `siteEmail` VARCHAR(255) NULL,
    `storePhone` VARCHAR(255) NULL,
    `adminId` INTEGER NOT NULL,

    UNIQUE INDEX `AdminSettings_adminId_key`(`adminId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OperationalSettings` (
    `adminId` INTEGER NOT NULL,
    `timeZone` VARCHAR(255) NULL,
    `currency` VARCHAR(255) NULL,
    `taxRate` DOUBLE NULL,
    `freeShippingThreshold` DOUBLE NULL,
    `orderProcessingTime` INTEGER NULL,
    `facebook` VARCHAR(191) NULL DEFAULT '',
    `instagram` VARCHAR(191) NULL DEFAULT '',
    `twitter` VARCHAR(191) NULL DEFAULT '',
    `minimumOrderAmount` DOUBLE NULL,
    `backupFrequency` VARCHAR(191) NULL DEFAULT '',

    UNIQUE INDEX `OperationalSettings_adminId_key`(`adminId`),
    PRIMARY KEY (`adminId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wishlist` (
    `userId` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`userId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `userId` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`userId`, `productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MostlySearched` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productid` VARCHAR(191) NULL,
    `numberofsearch` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MostlySearched_productid_key`(`productid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mostlyViewed` (
    `productId` VARCHAR(191) NOT NULL,
    `views` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `mostlyViewed_productId_key`(`productId`),
    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mostlyWishlisted` (
    `productId` VARCHAR(191) NOT NULL,
    `numberOfTimesWishlisted` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `mostlyWishlisted_productId_key`(`productId`),
    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reviews` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `review` VARCHAR(5000) NULL,
    `ratings` DOUBLE NOT NULL,
    `deliveryRatings` DOUBLE NOT NULL,
    `dispatchRatings` DOUBLE NOT NULL,

    UNIQUE INDEX `Reviews_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportTicket` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `details` TEXT NOT NULL,
    `status` ENUM('UNOPENED', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED') NOT NULL DEFAULT 'UNOPENED',
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoryParentChild` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoryParentChild_AB_unique`(`A`, `B`),
    INDEX `_CategoryParentChild_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductCategories` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProductCategories_AB_unique`(`A`, `B`),
    INDEX `_ProductCategories_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seller` ADD CONSTRAINT `Seller_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admins` ADD CONSTRAINT `Admins_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Unit` ADD CONSTRAINT `Unit_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordReset` ADD CONSTRAINT `PasswordReset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminSettings` ADD CONSTRAINT `AdminSettings_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admins`(`adminId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OperationalSettings` ADD CONSTRAINT `OperationalSettings_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Admins`(`adminId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MostlySearched` ADD CONSTRAINT `MostlySearched_productid_fkey` FOREIGN KEY (`productid`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mostlyViewed` ADD CONSTRAINT `mostlyViewed_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mostlyWishlisted` ADD CONSTRAINT `mostlyWishlisted_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupportTicket` ADD CONSTRAINT `SupportTicket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryParentChild` ADD CONSTRAINT `_CategoryParentChild_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoryParentChild` ADD CONSTRAINT `_CategoryParentChild_B_fkey` FOREIGN KEY (`B`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductCategories` ADD CONSTRAINT `_ProductCategories_A_fkey` FOREIGN KEY (`A`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductCategories` ADD CONSTRAINT `_ProductCategories_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
