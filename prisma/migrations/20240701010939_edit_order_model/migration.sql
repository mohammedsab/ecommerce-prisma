/*
  Warnings:

  - You are about to drop the column `orderNumber` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_shippingAddressId_fkey`;

-- DropIndex
DROP INDEX `orders_orderNumber_key` ON `orders`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `orderNumber`,
    DROP COLUMN `shippingAddressId`,
    ADD COLUMN `shippingAddress` VARCHAR(191) NULL;
