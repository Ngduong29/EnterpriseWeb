-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.41 - MySQL Community Server - GPL
-- Server OS:                    Linux
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for tutordb
CREATE DATABASE IF NOT EXISTS `tutordb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tutordb`;

-- Dumping structure for table tutordb.Blogs
CREATE TABLE IF NOT EXISTS `Blogs` (
  `blog_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  `content` text,
  `title` text,
  `status` tinyint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`blog_id`),
  KEY `student_id` (`student_id`),
  KEY `class_id` (`class_id`) USING BTREE,
  CONSTRAINT `Blogs_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `Users` (`userID`),
  CONSTRAINT `FK_Blogs_tutordb.Classes` FOREIGN KEY (`class_id`) REFERENCES `Classes` (`classID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Blogs: ~6 rows (approximately)
INSERT IGNORE INTO `Blogs` (`blog_id`, `student_id`, `class_id`, `content`, `title`, `status`, `created_at`, `updated_at`) VALUES
	(1, 5, 1, 'hello', 'hi', 1, '2025-04-14 09:07:16', '2025-04-14 13:37:25'),
	(2, 5, 2, 'bai thu 2', 'tieu de ne', 1, '2025-04-14 09:23:20', '2025-04-14 13:55:41'),
	(3, 4, 3, 'content', 'title', 1, '2025-04-14 09:35:16', '2025-04-14 13:36:01'),
	(5, 4, 1, 'Nội dung', 'Tiêu đề', 0, '2025-04-14 13:12:33', '2025-04-14 13:35:57'),
	(6, 3, 1, 'Nội dung', 'Tiêu đề', 0, '2025-04-14 13:12:50', '2025-04-14 13:35:58'),
	(7, 3, 2, 'Nội dung', 'Tiêu đề', 0, '2025-04-14 13:12:52', '2025-04-14 13:35:58');

-- Dumping structure for table tutordb.Blog_Comments
CREATE TABLE IF NOT EXISTS `Blog_Comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `blog_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `blog_id` (`blog_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Blog_Comments_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `Blogs` (`blog_id`),
  CONSTRAINT `Blog_Comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Blog_Comments: ~0 rows (approximately)

-- Dumping structure for table tutordb.Classes
CREATE TABLE IF NOT EXISTS `Classes` (
  `classID` int NOT NULL AUTO_INCREMENT,
  `className` varchar(100) NOT NULL,
  `videoLink` varchar(255) DEFAULT NULL,
  `subject` varchar(100) NOT NULL,
  `tutorID` varchar(10) NOT NULL,
  `studentID` varchar(10) DEFAULT NULL,
  `paymentID` int DEFAULT NULL,
  `length` int NOT NULL,
  `available` tinyint(1) DEFAULT '1',
  `type` varchar(50) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`classID`),
  KEY `tutorID` (`tutorID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`tutorID`) REFERENCES `tutors` (`tutorID`),
  CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`studentID`) REFERENCES `students` (`studentID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Classes: ~3 rows (approximately)
INSERT IGNORE INTO `Classes` (`classID`, `className`, `videoLink`, `subject`, `tutorID`, `studentID`, `paymentID`, `length`, `available`, `type`, `description`, `price`, `isActive`, `createdAt`, `updatedAt`) VALUES
	(1, 'Advanced Mathematics', NULL, 'Mathematics', 'T1', 'S1', 1, 60, 1, NULL, 'Advanced math concepts for high school students', 100.00, 1, '2025-04-13 06:33:04', '2025-04-13 06:33:04'),
	(2, 'Physics Basics', NULL, 'Physics', 'T2', 'S2', 2, 90, 1, NULL, 'Introduction to physics principles', 150.00, 1, '2025-04-13 06:33:04', '2025-04-13 06:33:04'),
	(3, 'Calculus 101', NULL, 'Mathematics', 'T1', NULL, NULL, 60, 1, NULL, 'Basic calculus course', 200.00, 1, '2025-04-13 06:33:04', '2025-04-13 06:33:04');

-- Dumping structure for table tutordb.Complains
CREATE TABLE IF NOT EXISTS `Complains` (
  `complainID` int NOT NULL AUTO_INCREMENT,
  `uID` int NOT NULL,
  `message` text NOT NULL,
  `status` enum('Pending','Resolved') DEFAULT 'Pending',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`complainID`),
  KEY `uID` (`uID`),
  CONSTRAINT `complains_ibfk_1` FOREIGN KEY (`uID`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Complains: ~3 rows (approximately)
INSERT IGNORE INTO `Complains` (`complainID`, `uID`, `message`, `status`, `createdAt`, `updatedAt`) VALUES
	(1, 4, 'The class schedule is not convenient', 'Pending', '2025-04-13 06:33:04', '2025-04-13 06:33:04'),
	(2, 5, 'Need more practice materials', 'Resolved', '2025-04-13 06:33:04', '2025-04-13 06:33:04'),
	(3, 4, 'chán vcl', 'Pending', '2025-04-13 08:35:27', '2025-04-13 08:35:27');

-- Dumping structure for table tutordb.Feedbacks
CREATE TABLE IF NOT EXISTS `Feedbacks` (
  `feedbackID` int NOT NULL AUTO_INCREMENT,
  `tutorID` varchar(10) NOT NULL,
  `classID` int NOT NULL,
  `studentID` varchar(10) NOT NULL,
  `feedbackDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `message` text,
  `rating` int NOT NULL,
  PRIMARY KEY (`feedbackID`),
  KEY `tutorID` (`tutorID`),
  KEY `classID` (`classID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`tutorID`) REFERENCES `Tutors` (`tutorID`),
  CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`classID`) REFERENCES `Classes` (`classID`),
  CONSTRAINT `feedbacks_ibfk_3` FOREIGN KEY (`studentID`) REFERENCES `Students` (`studentID`),
  CONSTRAINT `Feedbacks_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Feedbacks: ~2 rows (approximately)
INSERT IGNORE INTO `Feedbacks` (`feedbackID`, `tutorID`, `classID`, `studentID`, `feedbackDate`, `message`, `rating`) VALUES
	(1, 'T1', 1, 'S1', '2025-04-13 06:33:04', 'Great teaching style and very patient with students. The explanations were clear and easy to understand.', 5),
	(3, 'T1', 3, 'S1', '2025-04-13 06:33:04', 'Very interactive sessions. The tutor encouraged questions and discussions.', 4);

-- Dumping structure for table tutordb.Messages
CREATE TABLE IF NOT EXISTS `Messages` (
  `messageID` int NOT NULL AUTO_INCREMENT,
  `senderID` int NOT NULL,
  `receiverID` int NOT NULL,
  `messageText` text NOT NULL,
  `senderType` enum('Student','Tutor','Moderator','Admin') NOT NULL,
  `receiverType` enum('Student','Tutor','Moderator','Admin') NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`messageID`),
  KEY `senderID` (`senderID`),
  KEY `receiverID` (`receiverID`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiverID`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Messages: ~9 rows (approximately)
INSERT IGNORE INTO `Messages` (`messageID`, `senderID`, `receiverID`, `messageText`, `senderType`, `receiverType`, `timestamp`) VALUES
	(1, 4, 2, 'Hello, I have a question about the math assignment', 'Student', 'Tutor', '2025-04-13 06:33:04'),
	(2, 2, 4, 'Sure, what would you like to know?', 'Tutor', 'Student', '2025-04-13 06:33:04'),
	(3, 5, 3, 'Can we schedule a physics tutoring session?', 'Student', 'Tutor', '2025-04-13 06:33:04'),
	(4, 3, 5, 'Yes, I have availability tomorrow at 2 PM', 'Tutor', 'Student', '2025-04-13 06:33:04'),
	(5, 4, 6, 'I need help with a technical issue', 'Student', 'Moderator', '2025-04-13 06:33:04'),
	(6, 6, 4, 'I can help you with that. What seems to be the problem?', 'Moderator', 'Student', '2025-04-13 06:33:04'),
	(7, 4, 2, 'hello', 'Student', 'Tutor', '2025-04-13 08:35:36'),
	(8, 4, 3, 'hello', 'Student', 'Tutor', '2025-04-13 08:35:48'),
	(9, 4, 3, 'hello', 'Student', 'Tutor', '2025-04-13 08:35:48');

-- Dumping structure for table tutordb.Payments
CREATE TABLE IF NOT EXISTS `Payments` (
  `paymentID` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Completed','Failed') DEFAULT 'Pending',
  `paymentMethod` varchar(50) DEFAULT NULL,
  `transactionID` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`paymentID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Payments: ~3 rows (approximately)
INSERT IGNORE INTO `Payments` (`paymentID`, `amount`, `status`, `paymentMethod`, `transactionID`, `createdAt`, `updatedAt`) VALUES
	(1, 100.00, 'Completed', 'Credit Card', 'TRX123456', '2025-04-13 06:33:04', '2025-04-13 06:33:04'),
	(2, 150.00, 'Pending', 'Bank Transfer', 'TRX123457', '2025-04-13 06:33:04', '2025-04-13 06:33:04'),
	(3, 200.00, 'Completed', 'Credit Card', 'TRX123458', '2025-04-13 06:33:04', '2025-04-13 06:33:04');

-- Dumping structure for table tutordb.Requests
CREATE TABLE IF NOT EXISTS `Requests` (
  `requestID` int NOT NULL AUTO_INCREMENT,
  `studentID` varchar(10) NOT NULL,
  `tutorID` varchar(10) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `description` text,
  `status` enum('Pending','Accepted','Rejected') DEFAULT 'Pending',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`requestID`),
  KEY `studentID` (`studentID`),
  KEY `tutorID` (`tutorID`),
  CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `students` (`studentID`),
  CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`tutorID`) REFERENCES `tutors` (`tutorID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Requests: ~3 rows (approximately)
INSERT IGNORE INTO `Requests` (`requestID`, `studentID`, `tutorID`, `subject`, `description`, `status`, `createdAt`, `updatedAt`) VALUES
	(1, 'S1', 'T1', 'Mathematics', 'Need help with calculus homework', 'Pending', '2025-04-13 06:41:50', '2025-04-13 06:41:50'),
	(2, 'S2', 'T2', 'Physics', 'Looking for physics tutoring sessions', 'Accepted', '2025-04-13 06:41:50', '2025-04-13 06:41:50'),
	(3, 'S1', 'T2', 'Physics', 'Need help with thermodynamics', 'Pending', '2025-04-13 06:41:50', '2025-04-13 06:41:50');

-- Dumping structure for table tutordb.Students
CREATE TABLE IF NOT EXISTS `Students` (
  `studentID` varchar(10) NOT NULL,
  `userID` int NOT NULL,
  `grade` varchar(50) DEFAULT NULL,
  `school` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`studentID`),
  KEY `userID` (`userID`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Students: ~2 rows (approximately)
INSERT IGNORE INTO `Students` (`studentID`, `userID`, `grade`, `school`, `createdAt`, `updatedAt`) VALUES
	('S1', 4, 'Grade 10', 'High School A', '2025-04-13 06:33:04', '2025-04-13 06:33:04'),
	('S2', 5, 'Grade 11', 'High School B', '2025-04-13 06:33:04', '2025-04-13 06:33:04');

-- Dumping structure for table tutordb.TutorRequests
CREATE TABLE IF NOT EXISTS `TutorRequests` (
  `requestID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `tutorID` varchar(50) NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`requestID`),
  KEY `userID` (`userID`),
  KEY `tutorID` (`tutorID`),
  CONSTRAINT `tutorrequests_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`),
  CONSTRAINT `tutorrequests_ibfk_2` FOREIGN KEY (`tutorID`) REFERENCES `tutors` (`tutorID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.TutorRequests: ~2 rows (approximately)
INSERT IGNORE INTO `TutorRequests` (`requestID`, `userID`, `tutorID`, `status`, `createdAt`, `updatedAt`) VALUES
	(1, 10, 'T3', 'Approved', '2025-04-13 08:48:06', '2025-04-13 10:00:55'),
	(2, 12, 'T4', 'Rejected', '2025-04-13 10:07:41', '2025-04-13 10:14:06');

-- Dumping structure for table tutordb.Tutors
CREATE TABLE IF NOT EXISTS `Tutors` (
  `tutorID` varchar(10) NOT NULL,
  `userID` int NOT NULL,
  `degrees` text,
  `identityCard` varchar(20) DEFAULT NULL,
  `workplace` varchar(100) DEFAULT NULL,
  `description` text,
  `rating` float DEFAULT '0',
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tutorID`),
  KEY `userID` (`userID`),
  CONSTRAINT `tutors_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Tutors: ~4 rows (approximately)
INSERT IGNORE INTO `Tutors` (`tutorID`, `userID`, `degrees`, `identityCard`, `workplace`, `description`, `rating`, `status`, `createdAt`, `updatedAt`) VALUES
	('T1', 2, 'PhD in Mathematics', 'ID123456', 'University of Science', 'Experienced math tutor with 5 years of teaching', 4.5, 'Approved', '2025-04-13 06:33:04', '2025-04-13 06:33:04'),
	('T2', 3, 'MSc in Physics', 'ID123457', 'High School Teacher', 'Physics expert with 3 years of tutoring experience', 4.8, 'Approved', '2025-04-13 06:33:04', '2025-04-13 06:33:04'),
	('T3', 10, 'https://firebasestorage.googleapis.com/v0/b/tutorverse-7a900.appspot.com/o/images%2F1a2a7252-0799-42ae-9256-c5776c6c05f5-images_69.jpg?alt=media&token=cf5e3e16-437b-48c6-b648-7f6f00e2ca60', 'ID123457', 'student1@example.com', 'he', 0, 'Pending', '2025-04-13 08:48:06', '2025-04-13 08:48:06'),
	('T4', 12, 'https://firebasestorage.googleapis.com/v0/b/tutorverse-7a900.appspot.com/o/images%2F448915af-6ba2-4f46-bee9-3ea139b627f1-images_64.jpg?alt=media&token=1b51163e-0274-4598-b48e-abbbfc698ff5', 'ID123457', 'dinhduy2012001@gmail.com', 'fe2222', 0, 'Pending', '2025-04-13 10:07:41', '2025-04-13 13:46:38');

-- Dumping structure for table tutordb.Users
CREATE TABLE IF NOT EXISTS `Users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(50) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `role` enum('Student','Tutor','Moderator','Admin') NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userName` (`userName`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table tutordb.Users: ~8 rows (approximately)
INSERT IGNORE INTO `Users` (`userID`, `userName`, `fullName`, `email`, `password`, `avatar`, `dateOfBirth`, `role`, `phone`, `address`, `isActive`, `createdAt`, `updatedAt`) VALUES
	(1, 'admin1', 'Admin User1', 'admin@example.com', '$2b$12$rQqmB70swhZ1vJp880VE8.VEcjmH9Y/d2xFJusgOBAkeDLeoEs652', NULL, '1970-01-01', 'Admin', '1234567890', 'Admin Address', 1, '2025-04-13 06:33:04', '2025-04-13 14:18:46'),
	(2, 'tutor1', 'John Tutor', 'tutor1@example.com', '$2b$12$rQqmB70swhZ1vJp880VE8.VEcjmH9Y/d2xFJusgOBAkeDLeoEs652', NULL, NULL, 'Tutor', '1234567891', 'Tutor Address 1', 1, '2025-04-13 06:33:04', '2025-04-13 06:37:50'),
	(3, 'tutor2', 'Jane Tutor', 'tutor2@example.com', '$2b$12$rQqmB70swhZ1vJp880VE8.VEcjmH9Y/d2xFJusgOBAkeDLeoEs652', NULL, NULL, 'Tutor', '1234567892', 'Tutor Address 2', 1, '2025-04-13 06:33:04', '2025-04-13 06:37:50'),
	(4, 'hiep ngu 2', 'Alice Student', 'student1@example.com', '$2b$12$rQqmB70swhZ1vJp880VE8.VEcjmH9Y/d2xFJusgOBAkeDLeoEs652', 'https://firebasestorage.googleapis.com/v0/b/tutorverse-7a900.appspot.com/o/images%2Faa0c5614-87cf-4bbf-9d96-a76ece4c1665-download.jpg?alt=media&token=acf1b9ce-7fb8-4735-a33a-b53a321932d2', '2009-11-16', 'Student', '1234567893', 'Student Address 1222', 1, '2025-04-13 06:33:04', '2025-04-14 14:14:26'),
	(5, 'student2', 'Bob Student', 'student2@example.com', '$2b$12$rQqmB70swhZ1vJp880VE8.VEcjmH9Y/d2xFJusgOBAkeDLeoEs652', 'https://firebasestorage.googleapis.com/v0/b/tutorverse-7a900.appspot.com/o/images%2F14cc668b-d79c-4381-833e-bdeaf9b6a6df-images_64.jpg?alt=media&token=37729961-64b3-4fc4-adef-e30a7fee56ec', '1970-01-01', 'Student', '1234567894', 'Student Address 2', 1, '2025-04-13 06:33:04', '2025-04-13 06:40:09'),
	(6, 'moderator1', 'Mike Moderator', 'moderator@example.com', '$2b$12$rQqmB70swhZ1vJp880VE8.VEcjmH9Y/d2xFJusgOBAkeDLeoEs652', NULL, NULL, 'Moderator', '1234567895', 'Moderator Address', 1, '2025-04-13 06:33:04', '2025-04-13 06:37:50'),
	(10, 'ddd', 'quoc hiep love dinh duy', 'dinhduy2012001@gmail.com', '$2b$12$rQqmB70swhZ1vJp880VE8.VEcjmH9Y/d2xFJusgOBAkeDLeoEs652', 'https://firebasestorage.googleapis.com/v0/b/tutorverse-7a900.appspot.com/o/images%2F10817c8b-7bc4-4b97-a0ab-88089805bce7-images_64.jpg?alt=media&token=c5ae396f-b67c-4050-a962-625528d44db1', '2006-01-17', 'Tutor', '0921581712', 'abcdef', 1, '2025-04-13 08:48:06', '2025-04-13 09:44:04'),
	(12, 'dddaa', 'quoc hiep love dinh duy', 'dinhduy20102001@gmail.com', '$2a$10$pKZLrFDh7Dn1h9LzS9Vs6eYtWt1.uwQc399fQVbFoSCKVE8AFhXCy', 'https://firebasestorage.googleapis.com/v0/b/tutorverse-7a900.appspot.com/o/images%2F95a61da3-29d1-4a5a-af40-144f583180a6-download.jpg?alt=media&token=9e57628c-d921-49fd-9f38-c0caf304a988', '2002-06-03', 'Tutor', '0921581712', 'Thaibinh', 1, '2025-04-13 10:07:41', '2025-04-13 14:11:07');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
