/*
  Warnings:

  - You are about to alter the column `numberofsearch` on the `mostlysearched` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `mostlysearched` MODIFY `numberofsearch` INTEGER NULL;
