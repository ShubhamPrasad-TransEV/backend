/*
  Warnings:

  - You are about to drop the column `default` on the `address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `address` DROP COLUMN `default`,
    ADD COLUMN `defaultAddress` BOOLEAN NOT NULL DEFAULT false;
