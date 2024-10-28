/*
  Warnings:

  - The primary key for the `_CategoryParentChild` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_ProductCategories` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `_CategoryParentChild` DROP PRIMARY KEY;

-- AlterTable
ALTER TABLE `_ProductCategories` DROP PRIMARY KEY;
