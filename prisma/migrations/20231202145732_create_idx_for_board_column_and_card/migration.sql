/*
  Warnings:

  - Added the required column `columnIdx` to the `BoardColumn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardIdx` to the `BoardColumnCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BoardColumn` ADD COLUMN `columnIdx` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `BoardColumnCard` ADD COLUMN `cardIdx` INTEGER NOT NULL;
