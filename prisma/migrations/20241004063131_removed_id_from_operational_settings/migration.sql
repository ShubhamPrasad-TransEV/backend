/*
  Warnings:

  - The primary key for the `operationalsettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `operationalsettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `operationalsettings` DROP PRIMARY KEY,
    DROP COLUMN `id`;
