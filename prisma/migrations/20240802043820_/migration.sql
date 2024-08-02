/*
  Warnings:

  - You are about to drop the column `email` on the `seller` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `seller` DROP COLUMN `email`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `email`;
