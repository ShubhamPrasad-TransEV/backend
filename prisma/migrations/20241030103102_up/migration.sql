/*
  Warnings:

  - Made the column `productDetails` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `deliveryRatings` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dispatchRatings` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `productDetails` JSON NOT NULL;

-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `deliveryRatings` DOUBLE NOT NULL,
    ADD COLUMN `dispatchRatings` DOUBLE NOT NULL;
