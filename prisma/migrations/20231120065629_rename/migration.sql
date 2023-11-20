/*
  Warnings:

  - You are about to drop the `boardlabels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `boardmembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `boardlabels` DROP FOREIGN KEY `BoardLabels_boardColumnCardId_fkey`;

-- DropForeignKey
ALTER TABLE `boardlabels` DROP FOREIGN KEY `BoardLabels_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `boardmembers` DROP FOREIGN KEY `BoardMembers_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `boardmembers` DROP FOREIGN KEY `BoardMembers_memberId_fkey`;

-- DropTable
DROP TABLE `boardlabels`;

-- DropTable
DROP TABLE `boardmembers`;

-- CreateTable
CREATE TABLE `BoardLabel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `boardId` INTEGER NOT NULL,
    `boardColumnCardId` INTEGER NULL,

    INDEX `BoardLabels_boardColumnCardId_fkey`(`boardColumnCardId`),
    INDEX `BoardLabels_boardId_fkey`(`boardId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BoardMember` (
    `memberId` INTEGER NOT NULL,
    `memberRole` ENUM('COLLABORATOR', 'ADMIN', 'OBSERVER') NOT NULL,
    `boardId` INTEGER NOT NULL,

    INDEX `BoardMember_boardId_fkey`(`boardId`),
    PRIMARY KEY (`memberId`, `boardId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BoardLabel` ADD CONSTRAINT `BoardLabels_boardColumnCardId_fkey` FOREIGN KEY (`boardColumnCardId`) REFERENCES `BoardColumnCard`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardLabel` ADD CONSTRAINT `BoardLabels_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardMember` ADD CONSTRAINT `BoardMember_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardMember` ADD CONSTRAINT `BoardMember_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
