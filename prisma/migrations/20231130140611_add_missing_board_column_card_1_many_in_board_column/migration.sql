-- AlterTable
ALTER TABLE `BoardColumnCard` ADD COLUMN `boardColumnId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `BoardColumnCard` ADD CONSTRAINT `BoardColumnCard_boardColumnId_fkey` FOREIGN KEY (`boardColumnId`) REFERENCES `BoardColumn`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
