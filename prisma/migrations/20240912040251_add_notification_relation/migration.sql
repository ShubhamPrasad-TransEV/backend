/*
  Warnings:

  - You are about to drop the column `address` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `contactPerson` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `seller` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `seller` DROP COLUMN `address`,
    DROP COLUMN `companyName`,
    DROP COLUMN `contactPerson`,
    DROP COLUMN `description`;
