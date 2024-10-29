-- CreateTable
CREATE TABLE `MostlySearched` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productid` VARCHAR(191) NULL,
    `numberofsearch` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MostlySearched` ADD CONSTRAINT `MostlySearched_productid_fkey` FOREIGN KEY (`productid`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
