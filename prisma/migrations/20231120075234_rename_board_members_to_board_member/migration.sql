/*
  Warnings:

  - You are about to drop the `BoardMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `BoardMembers` DROP FOREIGN KEY `BoardMembers_boardId_fkey`;

-- DropForeignKey
ALTER TABLE `BoardMembers` DROP FOREIGN KEY `BoardMembers_memberId_fkey`;

-- DropTable
DROP TABLE `BoardMembers`;

-- CreateTable
CREATE TABLE `BoardMember` (
    `memberId` INTEGER NOT NULL,
    `memberRole` ENUM('COLLABORATOR', 'ADMIN', 'OBSERVER') NOT NULL,
    `boardId` INTEGER NOT NULL,

    PRIMARY KEY (`memberId`, `boardId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BoardMember` ADD CONSTRAINT `BoardMember_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardMember` ADD CONSTRAINT `BoardMember_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
