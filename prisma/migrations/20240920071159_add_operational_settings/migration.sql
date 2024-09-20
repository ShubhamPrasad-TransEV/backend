-- CreateTable
CREATE TABLE `OperationalSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timeZone` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `taxRate` DOUBLE NOT NULL,
    `freeShippingThreshold` DOUBLE NOT NULL,
    `orderProcessingTime` INTEGER NOT NULL,
    `facebook` VARCHAR(191) NULL DEFAULT '',
    `instagram` VARCHAR(191) NULL DEFAULT '',
    `twitter` VARCHAR(191) NULL DEFAULT '',
    `minimumOrderAmount` DOUBLE NOT NULL,
    `backupFrequency` VARCHAR(191) NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
