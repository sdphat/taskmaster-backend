/*
  Warnings:

  - You are about to drop the `boardlabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `boardmember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `boardlabel` DROP FOREIGN KEY `BoardLabels_boardColumnCardId_fkey`;

-- DropForeignKey
ALTER TABLE `boardlabel` DROP FOREIGN KEY `BoardLabels_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `boardmember` DROP FOREIGN KEY `BoardMember_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `boardmember` DROP FOREIGN KEY `BoardMember_memberId_fkey`;

-- DropTable
DROP TABLE `boardlabel`;

-- DropTable
DROP TABLE `boardmember`;

-- CreateTable
CREATE TABLE `BoardLabels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `boardId` INTEGER NOT NULL,
    `boardColumnCardId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BoardMembers` (
    `memberId` INTEGER NOT NULL,
    `memberRole` ENUM('COLLABORATOR', 'ADMIN', 'OBSERVER') NOT NULL,
    `boardId` INTEGER NOT NULL,

    PRIMARY KEY (`memberId`, `boardId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BoardLabels` ADD CONSTRAINT `BoardLabels_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardLabels` ADD CONSTRAINT `BoardLabels_boardColumnCardId_fkey` FOREIGN KEY (`boardColumnCardId`) REFERENCES `BoardColumnCard`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardMembers` ADD CONSTRAINT `BoardMembers_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardMembers` ADD CONSTRAINT `BoardMembers_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
