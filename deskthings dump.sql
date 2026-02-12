-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: mysql-309b449a-deskthings.c.aivencloud.com    Database: deskthingsdb
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '0b3425a1-0801-11f1-8560-b6f6555d671d:1-60,
266bf52a-fd02-11f0-9801-5ed0443452d5:1-87';

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `cutomer_id` int NOT NULL,
  `street` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  `post_code` int NOT NULL,
  `state` varchar(45) DEFAULT NULL,
  `country` varchar(45) NOT NULL,
  PRIMARY KEY (`address_id`),
  UNIQUE KEY `address_id_UNIQUE` (`address_id`),
  KEY `addresses_cutomers_fk_idx` (`cutomer_id`),
  CONSTRAINT `addresses_cutomers_fk` FOREIGN KEY (`cutomer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,1,'Storgatan 12','Stockholm',11122,'Stockholm','Sweden'),(2,1,'Vasagatan 5','Stockholm',11123,'Stockholm','Sweden'),(3,2,'Kungsgatan 8','Göteborg',41119,'Västra Götaland','Sweden'),(4,3,'Drottninggatan 3','Malmö',21111,'Skåne','Sweden'),(5,1,'Birger Jarlsgatan 10','Stockholm',11434,'Stockholm','Sweden');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'IKEA'),(2,'Logitech'),(3,'Moleskine'),(4,'Generic'),(5,'Philips');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL DEFAULT 'Untitled Category',
  `description` text,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Furniture','Desks, shelves and storage'),(2,'Electronics','Keyboards, mice, lamps'),(3,'Stationery','Pens, notebooks, paper'),(4,'Decor','Plants, art, figurines'),(5,'Accessories','Cable management, stands');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `shipping_address_id` int DEFAULT NULL,
  `billing_address_id` int NOT NULL,
  `payment_method_id` int DEFAULT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `date_joined` datetime NOT NULL,
  `password_hash` varchar(45) NOT NULL,
  `last_login` datetime NOT NULL,
  `is_active` tinyint DEFAULT '1',
  `date_deleted` datetime DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `customer_id_UNIQUE` (`customer_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `customers_addresses_fk_idx` (`billing_address_id`),
  KEY `customers_addresses_fk_idx1` (`shipping_address_id`),
  KEY `customers_payment_methods_fk_idx` (`payment_method_id`),
  CONSTRAINT `customers_billing_address_fk` FOREIGN KEY (`billing_address_id`) REFERENCES `addresses` (`address_id`) ON DELETE RESTRICT,
  CONSTRAINT `customers_payment_methods_fk` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`payment_method_id`) ON DELETE RESTRICT,
  CONSTRAINT `customers_shipping_address_fk` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses` (`address_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,1,2,1,'Malco','Olsson','malco@example.com','070-1112233','2026-01-15 10:30:00','$2b$10$dummyhash1','2026-02-10 08:12:00',1,NULL),(2,3,3,2,'Emma','Svensson','emma@example.com','070-4455667','2026-01-20 14:15:00','$2b$10$dummyhash2','2026-02-11 09:30:00',1,NULL),(3,4,4,3,'Ali','Khan','ali@example.com','070-9988776','2026-02-01 09:00:00','$2b$10$dummyhash3','2026-02-12 10:05:00',1,NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_rows`
--

DROP TABLE IF EXISTS `order_rows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_rows` (
  `order_row_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `weight_kg` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`order_row_id`),
  UNIQUE KEY `order_row_id_UNIQUE` (`order_row_id`),
  KEY `order_rows_products_fk_idx` (`product_id`),
  KEY `order_rows_orders_fk_idx` (`order_id`),
  CONSTRAINT `order_rows_orders_fk` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_rows_products_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_rows`
--

LOCK TABLES `order_rows` WRITE;
/*!40000 ALTER TABLE `order_rows` DISABLE KEYS */;
INSERT INTO `order_rows` VALUES (1,1,2,1,899.00,0.15),(2,1,7,1,149.00,0.50),(3,2,4,2,129.00,0.30),(4,3,5,1,249.00,1.20),(5,4,8,1,749.00,0.35),(6,5,3,1,599.00,0.80),(7,6,6,2,89.00,0.25),(8,6,1,1,199.00,2.50);
/*!40000 ALTER TABLE `order_rows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `address_id` int NOT NULL,
  `payment_method_id` int NOT NULL,
  `order_date` datetime NOT NULL,
  `total_weight` decimal(10,2) DEFAULT NULL,
  `total_sum` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_id_UNIQUE` (`order_id`),
  KEY `orders_cutomers_fk_idx` (`customer_id`),
  KEY `orders_payment_methods_fk_idx` (`payment_method_id`),
  KEY `orders_addresses_fk_idx` (`address_id`),
  CONSTRAINT `orders_addresses_fk` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`),
  CONSTRAINT `orders_cutomers_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE RESTRICT,
  CONSTRAINT `orders_payment_methods_fk` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`payment_method_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,1,'2026-02-10 11:22:33',2.65,898.00),(2,2,3,2,'2026-02-11 15:44:12',0.45,129.00),(3,3,4,3,'2026-02-12 09:08:07',1.00,249.00),(4,1,1,1,'2026-02-12 14:20:00',0.35,749.00),(5,2,3,2,'2026-02-13 10:05:33',0.80,599.00),(6,1,5,4,'2026-02-14 16:30:00',0.55,238.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `payment_method_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `card_number_hash` int DEFAULT NULL,
  `name_on_card` varchar(45) DEFAULT NULL,
  `card_security_number_hash` varchar(45) DEFAULT NULL,
  `card_expiry` varchar(45) DEFAULT NULL,
  `payment_type` varchar(45) NOT NULL DEFAULT 'card',
  `is_current` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`payment_method_id`),
  UNIQUE KEY `payment_methods_id_UNIQUE` (`payment_method_id`),
  UNIQUE KEY `card_number_hash_UNIQUE` (`card_number_hash`),
  KEY `payment_methods_customers_fk_idx` (`customer_id`),
  CONSTRAINT `payment_methods_customers_fk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,1,123456789,'Malco Olsson','789','12/28','card',1),(2,2,987654321,'Emma Svensson','123','05/27','card',1),(3,3,555666777,'Ali Khan','567','09/29','card',1),(4,1,NULL,NULL,NULL,NULL,'swish',0);
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `subcategory_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `weight_kg` decimal(10,2) DEFAULT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `on_sale` tinyint NOT NULL DEFAULT '0',
  `stock_qty` int NOT NULL DEFAULT '0',
  `img_url` varchar(200) DEFAULT 'www.deskthings.com/uploads/products/image_default.jpg',
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_id_UNIQUE` (`product_id`),
  KEY `products_subcategory_fk_idx` (`subcategory_id`),
  KEY `products_brand_fk_idx` (`brand_id`),
  CONSTRAINT `products_brands_fk` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `products_subcategories_fk` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`subcategory_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,1,'Skådis Pegboard','Pegboard for organising desk accessories. Includes hooks.',199.00,2.50,NULL,0,50,'www.deskthings.com/uploads/products/skadis.jpg'),(2,2,2,'MX Master 3S','Ergonomic wireless mouse with MagSpeed scrolling.',899.00,0.15,799.00,1,30,'www.deskthings.com/uploads/products/mxmaster.jpg'),(3,3,5,'Sälen LED Desk Lamp','LED lamp with wireless charging base and touch dimmer.',599.00,0.80,NULL,0,15,'www.deskthings.com/uploads/products/salen.jpg'),(4,4,3,'Cahier Notebook (Set of 2)','Dotted notebooks, 80 pages each, kraft cover.',129.00,0.30,NULL,0,100,'www.deskthings.com/uploads/products/notebook.jpg'),(5,5,4,'Fikus Artificial Plant','Faux rubber tree in a ceramic pot. Height 30 cm.',249.00,1.20,199.00,1,20,'www.deskthings.com/uploads/products/fikus.jpg'),(6,6,4,'Ceramic Pen Holder','Minimalist white ceramic cup for pens and tools.',89.00,0.25,NULL,0,45,'www.deskthings.com/uploads/products/penholder.jpg'),(7,6,1,'Cable Management Box','Hide power strips and cables. White, 30x12x10 cm.',149.00,0.50,NULL,0,60,'www.deskthings.com/uploads/products/cablebox.jpg'),(8,2,2,'MX Keys Mini','Compact wireless keyboard with backlighting.',749.00,0.35,699.00,1,25,'www.deskthings.com/uploads/products/mxkeys.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategories` (
  `subcategory_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(45) NOT NULL DEFAULT 'Untitled Subcategory',
  `description` text,
  PRIMARY KEY (`subcategory_id`),
  KEY `subcategories_categories_fk_idx` (`category_id`),
  CONSTRAINT `subcategories_categories_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES (1,1,'Shelving','Wall‑mounted shelves and pegboards'),(2,2,'Mice','Computer mice – wired and wireless'),(3,2,'Lighting','Desk lamps and LED strips'),(4,3,'Notebooks','Journals, notebooks, planners'),(5,4,'Plants','Faux greenery and pots'),(6,5,'Organisers','Pen holders, cable boxes, trays');
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tagged_products`
--

DROP TABLE IF EXISTS `tagged_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tagged_products` (
  `tagged_products_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`tagged_products_id`),
  UNIQUE KEY `tagged_products_id_UNIQUE` (`tagged_products_id`),
  KEY `tagged_products_products_fk_idx` (`product_id`),
  KEY `tagged_products_tags_fk_idx` (`tag_id`),
  CONSTRAINT `tagged_products_products_fk` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tagged_products_tags_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tagged_products`
--

LOCK TABLES `tagged_products` WRITE;
/*!40000 ALTER TABLE `tagged_products` DISABLE KEYS */;
INSERT INTO `tagged_products` VALUES (1,1,2),(2,2,1),(3,2,4),(4,3,1),(5,3,8),(6,4,5),(7,5,3),(8,6,3),(9,7,3),(10,8,1),(11,8,4),(12,1,3);
/*!40000 ALTER TABLE `tagged_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'wireless'),(2,'wooden'),(3,'minimalist'),(4,'ergonomic'),(5,'vintage'),(6,'RGB'),(7,'waterproof'),(8,'adjustable');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-12 15:20:20
