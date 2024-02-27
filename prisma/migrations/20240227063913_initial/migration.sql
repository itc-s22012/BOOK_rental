-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(256) NOT NULL,
    `name` VARCHAR(100) NULL,
    `password` TINYBLOB NOT NULL,
    `salt` TINYBLOB NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `books` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `isbn13` DECIMAL(13, 0) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `author` VARCHAR(100) NOT NULL,
    `publishDate` DATE NOT NULL,

    UNIQUE INDEX `books_isbn13_key`(`isbn13`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rental` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `rentalDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnDeadline` DATETIME(3) NOT NULL DEFAULT DATE_ADD(NOW(), INTERVAL 7 DAY),
    `returnDate` DATETIME(6) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rental` ADD CONSTRAINT `rental_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rental` ADD CONSTRAINT `rental_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
