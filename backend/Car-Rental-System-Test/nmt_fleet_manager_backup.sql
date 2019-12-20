-- MySQL dump 10.13  Distrib 5.7.24, for Win64 (x86_64)
--
-- Host: localhost    Database: nmt_fleet_manager
-- ------------------------------------------------------
-- Server version	5.7.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `nmt_fleet_manager`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `nmt_fleet_manager` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `nmt_fleet_manager`;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `vehicle_uuid` char(36) NOT NULL,
  `started_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_odometer` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `type` enum('D','K') NOT NULL DEFAULT 'D',
  `cost` decimal(10,2) unsigned DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`uuid`),
  KEY `vehicle_id` (`vehicle_id`,`vehicle_uuid`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`vehicle_id`, `vehicle_uuid`) REFERENCES `vehicles` (`id`, `uuid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'3e933953-5b14-40b9-b04c-00c968d49d39',1,'23c07876-a967-4cf0-bf22-0fdeaf7beb06','2019-11-28 00:00:00','2019-11-29 00:00:00',900.00,'D',100.00,'2019-12-12 02:10:50',NULL),(2,'a6bd0071-77cd-46a1-a338-8c897e4108b0',2,'37b80138-56e3-4834-9870-5c618e648d0c','2019-11-28 00:00:00','2019-11-30 00:00:00',500.00,'K',0.00,'2019-12-12 02:10:50',NULL),(3,'963bc486-cc1a-4463-8cfb-98b0782f115a',3,'3fc41603-8b8a-4207-bba4-a49095f36692','2019-11-28 00:00:00','2019-12-04 00:00:00',10000.00,'D',600.00,'2019-12-12 02:10:50',NULL),(4,'71e8702f-d387-4722-80b2-f5486ef7793e',4,'6cf6b703-c154-4e34-a79f-de9be3d10d88','2019-12-05 00:00:00','2019-12-07 00:00:00',15000.00,'K',0.00,'2019-12-12 02:10:50',NULL),(5,'0113f97c-eee1-46dd-a779-04f268db536a',5,'6f818b4c-da01-491b-aed9-5c51771051a5','2019-12-13 00:00:00','2019-12-20 00:00:00',20000.00,'D',700.00,'2019-12-12 02:10:50',NULL);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fuel_purchases`
--

DROP TABLE IF EXISTS `fuel_purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fuel_purchases` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `booking_id` bigint(20) unsigned NOT NULL,
  `booking_uuid` char(36) NOT NULL,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `vehicle_uuid` char(36) NOT NULL,
  `fuel_quantity` decimal(5,2) unsigned NOT NULL DEFAULT '0.00',
  `fuel_price` decimal(5,2) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`uuid`),
  KEY `vehicle_id` (`vehicle_id`,`vehicle_uuid`),
  KEY `booking_id` (`booking_id`,`booking_uuid`),
  CONSTRAINT `fuel_purchases_ibfk_1` FOREIGN KEY (`vehicle_id`, `vehicle_uuid`) REFERENCES `vehicles` (`id`, `uuid`) ON DELETE CASCADE,
  CONSTRAINT `fuel_purchases_ibfk_2` FOREIGN KEY (`booking_id`, `booking_uuid`) REFERENCES `bookings` (`id`, `uuid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuel_purchases`
--

LOCK TABLES `fuel_purchases` WRITE;
/*!40000 ALTER TABLE `fuel_purchases` DISABLE KEYS */;
INSERT INTO `fuel_purchases` VALUES (1,'faf91e4f-a948-41e2-b524-e267f4e8d75d',1,'3e933953-5b14-40b9-b04c-00c968d49d39',1,'23c07876-a967-4cf0-bf22-0fdeaf7beb06',60.00,1.20,'2019-12-12 02:11:24',NULL),(2,'55853368-d34e-45cf-a03b-4529281d3a10',2,'a6bd0071-77cd-46a1-a338-8c897e4108b0',2,'37b80138-56e3-4834-9870-5c618e648d0c',10.00,1.30,'2019-12-12 02:11:24',NULL),(3,'b62ac6b8-ad5d-4f96-825d-6658471b26d1',4,'71e8702f-d387-4722-80b2-f5486ef7793e',4,'6cf6b703-c154-4e34-a79f-de9be3d10d88',30.00,1.40,'2019-12-12 02:11:24',NULL),(4,'39f06ed5-a685-4619-b20b-aeefc49e4ee7',5,'0113f97c-eee1-46dd-a779-04f268db536a',5,'6f818b4c-da01-491b-aed9-5c51771051a5',5.00,1.20,'2019-12-12 02:11:24',NULL);
/*!40000 ALTER TABLE `fuel_purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `journeys`
--

DROP TABLE IF EXISTS `journeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `journeys` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `booking_id` bigint(20) unsigned NOT NULL,
  `booking_uuid` char(36) NOT NULL,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `vehicle_uuid` char(36) NOT NULL,
  `started_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `journey_from` varchar(128) DEFAULT 'Unknown',
  `journey_to` varchar(128) DEFAULT 'Unknown',
  `start_odometer` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `end_odometer` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`uuid`),
  KEY `vehicle_id` (`vehicle_id`,`vehicle_uuid`),
  KEY `booking_id` (`booking_id`,`booking_uuid`),
  CONSTRAINT `journeys_ibfk_1` FOREIGN KEY (`vehicle_id`, `vehicle_uuid`) REFERENCES `vehicles` (`id`, `uuid`) ON DELETE CASCADE,
  CONSTRAINT `journeys_ibfk_2` FOREIGN KEY (`booking_id`, `booking_uuid`) REFERENCES `bookings` (`id`, `uuid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `journeys`
--

LOCK TABLES `journeys` WRITE;
/*!40000 ALTER TABLE `journeys` DISABLE KEYS */;
INSERT INTO `journeys` VALUES (1,'83d2722f-baf5-4632-85a1-4cb1c02185ee',1,'3e933953-5b14-40b9-b04c-00c968d49d39',1,'23c07876-a967-4cf0-bf22-0fdeaf7beb06','2019-11-28 00:00:00','2019-11-29 00:00:00','Perth','Geraldton',900.00,1315.00,'2019-12-12 02:11:12','2019-12-12 02:11:12'),(2,'ff55c6c4-7988-4197-9779-c8702520745a',2,'a6bd0071-77cd-46a1-a338-8c897e4108b0',2,'37b80138-56e3-4834-9870-5c618e648d0c','2019-11-29 00:00:00','2019-11-30 00:00:00','Perth','Subiaco',500.00,504.00,'2019-12-12 02:11:12','2019-12-12 02:11:12'),(3,'2e0dfc1f-5042-4be1-9241-7febfea5dc89',3,'963bc486-cc1a-4463-8cfb-98b0782f115a',3,'3fc41603-8b8a-4207-bba4-a49095f36692','2019-11-28 00:00:00','2019-11-29 00:00:00','Perth','Margaret River',10000.00,10270.00,'2019-12-12 02:11:12','2019-12-12 02:11:12'),(4,'c27dea31-25aa-4efe-8411-327e9b934144',4,'71e8702f-d387-4722-80b2-f5486ef7793e',4,'6cf6b703-c154-4e34-a79f-de9be3d10d88','2019-12-05 00:00:00','2019-12-06 00:00:00','Perth','Lancelin',15000.00,15122.00,'2019-12-12 02:11:12','2019-12-12 02:11:12'),(5,'9521972a-e38d-4830-a43a-77b1868c634b',5,'0113f97c-eee1-46dd-a779-04f268db536a',5,'6f818b4c-da01-491b-aed9-5c51771051a5','2019-12-13 00:00:00','2019-12-13 00:00:00','Perth','Joondalup',20000.00,20025.00,'2019-12-12 02:11:12','2019-12-12 02:11:12');
/*!40000 ALTER TABLE `journeys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `vehicle_uuid` char(36) NOT NULL,
  `odometer` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `serviced_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`uuid`),
  KEY `vehicle_id` (`vehicle_id`,`vehicle_uuid`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`vehicle_id`, `vehicle_uuid`) REFERENCES `vehicles` (`id`, `uuid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'67f7fcc5-e591-401c-ba5c-7eb49409fc2e',1,'23c07876-a967-4cf0-bf22-0fdeaf7beb06',1400.00,'2019-12-04 00:00:00','2019-12-12 02:11:37',NULL),(2,'a9d9f0af-95d2-47fd-9450-a8a8c5b6fb2e',2,'37b80138-56e3-4834-9870-5c618e648d0c',600.00,'2019-12-02 00:00:00','2019-12-12 02:11:37',NULL),(3,'d4307f3a-6637-45d3-8fc6-38844da4fc96',3,'3fc41603-8b8a-4207-bba4-a49095f36692',10300.00,'2019-12-06 00:00:00','2019-12-12 02:11:37',NULL),(4,'cae0f850-f55f-4d1b-a6d3-96bcce4fa7ec',4,'6cf6b703-c154-4e34-a79f-de9be3d10d88',15200.00,'2019-12-12 00:00:00','2019-12-12 02:11:37',NULL),(5,'f4a0a09c-315f-4c51-aba1-feee8f2e81cf',5,'6f818b4c-da01-491b-aed9-5c51771051a5',20100.00,'2019-12-21 00:00:00','2019-12-12 02:11:37',NULL);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `manufacturer` varchar(64) NOT NULL DEFAULT 'Unknown',
  `model` varchar(128) NOT NULL,
  `year` int(4) unsigned zerofill NOT NULL DEFAULT '0001',
  `odometer` decimal(10,2) unsigned NOT NULL DEFAULT '0.00',
  `registration` varchar(16) NOT NULL,
  `fuel_type` varchar(8) NOT NULL DEFAULT 'Unknown',
  `tank_size` decimal(5,2) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,'23c07876-a967-4cf0-bf22-0fdeaf7beb06','Bugatti','Veyron 16.4 Super Sport',2011,1500.00,'1VEYRON','Unknown',100.00,'2019-12-12 02:10:39','2019-12-12 21:02:58'),(2,'37b80138-56e3-4834-9870-5c618e648d0c','Ford','Ranger XL',2015,800.00,'1GVL526','Unknown',80.00,'2019-12-12 02:10:39','2019-12-12 21:05:06'),(3,'3fc41603-8b8a-4207-bba4-a49095f36692','Tesla','Roadster',2008,11000.00,'8HDZ576','Unknown',0.00,'2019-12-12 02:10:39','2019-12-12 21:05:41'),(4,'6cf6b703-c154-4e34-a79f-de9be3d10d88','Land Rover','Defender',2015,15500.00,'BCZ5810','Unknown',60.00,'2019-12-12 02:10:39','2019-12-12 21:06:12'),(5,'6f818b4c-da01-491b-aed9-5c51771051a5','Holden','Commodore LT ',2018,20200.00,'1GXI000','Unknown',61.00,'2019-12-12 02:10:39','2019-12-12 21:06:58'),(7,'9e28c497-251f-4328-9c97-3e1faa6d2c5f','Ford','Focus',2001,9000.00,'FOCUS20','Unknown',60.00,'2019-12-16 18:45:57',NULL);
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-20  1:09:37
