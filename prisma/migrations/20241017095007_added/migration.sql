/*
  Warnings:

  - You are about to drop the `orderitem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderedItems` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_productId_fkey`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `orderedItems` JSON NOT NULL;

-- DropTable
DROP TABLE `orderitem`;
