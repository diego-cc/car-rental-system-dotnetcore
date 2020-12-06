# DCC-FleetManager.sql
# For DDA-P2 assignment
# Name: Diego Craveiro Chaves
# Student ID: 20026893
# STEP 1: Create the Application
# Already completed on part 1 of the related TDD assignment (using React and Firebase)
# STEP 2: Create Database and User
# Log in to MySQL as the root user using the terminal
-- mysql -u root
# Create database
CREATE DATABASE IF NOT EXISTS nmt_fleet_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
# Create new user
CREATE USER IF NOT EXISTS 'nmt_fleet_manager' @'localhost' IDENTIFIED BY 'Fleet2019S2';
# Provide all permissions on the database for the new user
GRANT ALL PRIVILEGES ON nmt_fleet_manager.* TO 'nmt_fleet_manager' @'localhost' IDENTIFIED BY 'Fleet2019S2';
# STEP 3: Design Database Tables
# Log out as root user from the terminal
-- exit
# Log in as nmt_fleet_manager
-- mysql -u nmt_fleet_manager -p
# Enter password
-- Fleet2019S2
# Select database
USE nmt_fleet_manager;
# NOTE: The `uuid`s in the tables are used in the frontend, whilst the `id`s are used internally by the database
# Vehicles table
CREATE TABLE IF NOT EXISTS nmt_fleet_manager.vehicles (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `uuid` CHAR(36) NOT NULL,
    `manufacturer` VARCHAR(64) NOT NULL DEFAULT 'Unknown',
    `model` VARCHAR(128) NOT NULL,
    `year` INT(4) UNSIGNED ZEROFILL NOT NULL DEFAULT 1,
    `odometer` DECIMAL(10, 2) UNSIGNED NOT NULL DEFAULT 0.0,
    `registration` VARCHAR(16) NOT NULL,
    `fuel_type` VARCHAR(8) NOT NULL DEFAULT 'Unknown',
    `tank_size` DECIMAL(5, 2) UNSIGNED NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NULL ON UPDATE NOW(),
    INDEX (`id`, `uuid`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ENGINE = INNODB;
# Bookings table
CREATE TABLE IF NOT EXISTS nmt_fleet_manager.bookings (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `uuid` CHAR(36) NOT NULL,
    `vehicle_id` BIGINT UNSIGNED NOT NULL,
    `vehicle_uuid` CHAR(36) NOT NULL,
    `started_at` DATETIME NOT NULL DEFAULT NOW(),
    `ended_at` DATETIME NOT NULL DEFAULT NOW(),
    `start_odometer` DECIMAL(10, 2) UNSIGNED NOT NULL DEFAULT 0.0,
    `type` ENUM ('D', 'K') NOT NULL DEFAULT 'D',
    `cost` DECIMAL(10, 2) UNSIGNED DEFAULT 0.0,
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NULL ON UPDATE NOW(),
    INDEX (`id`, `uuid`),
    FOREIGN KEY (`vehicle_id`, `vehicle_uuid`) REFERENCES vehicles (`id`, `uuid`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ENGINE = INNODB;
# Journeys table
CREATE TABLE IF NOT EXISTS nmt_fleet_manager.journeys (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `uuid` CHAR(36) NOT NULL,
    `booking_id` BIGINT UNSIGNED NOT NULL,
    `booking_uuid` CHAR(36) NOT NULL,
    `vehicle_id` BIGINT UNSIGNED NOT NULL,
    `vehicle_uuid` CHAR(36) NOT NULL,
    `started_at` DATETIME NOT NULL DEFAULT NOW(),
    `ended_at` DATETIME NOT NULL DEFAULT NOW(),
    `journey_from` VARCHAR(128) DEFAULT 'Unknown',
    `journey_to` VARCHAR(128) DEFAULT 'Unknown',
    `start_odometer` DECIMAL(10, 2) UNSIGNED NOT NULL DEFAULT 0.0,
    `end_odometer` DECIMAL(10, 2) UNSIGNED NOT NULL DEFAULT 0.0,
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NOW() ON UPDATE NOW(),
    INDEX (`id`, `uuid`),
    FOREIGN KEY (`vehicle_id`, `vehicle_uuid`) REFERENCES vehicles (`id`, `uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`booking_id`, `booking_uuid`) REFERENCES bookings (`id`, `uuid`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ENGINE = INNODB;
# Services table
CREATE TABLE IF NOT EXISTS nmt_fleet_manager.services (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `uuid` CHAR(36) NOT NULL,
    `vehicle_id` BIGINT UNSIGNED NOT NULL,
    `vehicle_uuid` CHAR(36) NOT NULL,
    `odometer` DECIMAL(10, 2) UNSIGNED NOT NULL DEFAULT 0.0,
    `serviced_at` DATETIME NOT NULL DEFAULT NOW(),
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NULL ON UPDATE NOW(),
    INDEX (`id`, `uuid`),
    FOREIGN KEY (`vehicle_id`, `vehicle_uuid`) REFERENCES vehicles (`id`, `uuid`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ENGINE = INNODB;
# Fuel purchases table
CREATE TABLE IF NOT EXISTS nmt_fleet_manager.fuel_purchases (
    `id` BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL,
    `booking_id` BIGINT UNSIGNED NOT NULL,
    `booking_uuid` CHAR(36) NOT NULL,
    `vehicle_id` BIGINT UNSIGNED NOT NULL,
    `vehicle_uuid` CHAR(36) NOT NULL,
    `fuel_quantity` DECIMAL(5, 2) UNSIGNED NOT NULL DEFAULT 0.0,
    `fuel_price` DECIMAL(5, 2) UNSIGNED NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    `updated_at` DATETIME DEFAULT NULL ON UPDATE NOW(),
    INDEX (`id`, `uuid`),
    FOREIGN KEY (`vehicle_id`, `vehicle_uuid`) REFERENCES vehicles (`id`, `uuid`) ON DELETE CASCADE,
    FOREIGN KEY (`booking_id`, `booking_uuid`) REFERENCES bookings (`id`, `uuid`) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ENGINE = INNODB;
# STEP 3.5: Seed Data
# Vehicles:
INSERT INTO nmt_fleet_manager.vehicles(
        `uuid`,
        `manufacturer`,
        `model`,
        `year`,
        `odometer`,
        `registration`,
        `tank_size`
    )
VALUES (
        '23c07876-a967-4cf0-bf22-0fdeaf7beb06',
        'Bugatti',
        'Veyron 16.4 Super Sport',
        2011,
        900,
        '1VEYRON',
        100
    ),
    (
        '37b80138-56e3-4834-9870-5c618e648d0c',
        'Ford',
        'Ranger XL',
        2015,
        500,
        '1GVL526',
        80
    ),
    (
        '3fc41603-8b8a-4207-bba4-a49095f36692',
        'Tesla',
        'Roadster',
        2008,
        10000,
        '8HDZ576',
        0
    ),
    (
        '6cf6b703-c154-4e34-a79f-de9be3d10d88',
        'Land Rover',
        'Defender',
        2015,
        15000,
        'BCZ5810',
        60
    ),
    (
        '6f818b4c-da01-491b-aed9-5c51771051a5',
        'Holden',
        'Commodore LT ',
        2018,
        20000,
        '1GXI000',
        61
    );
# Bookings:
INSERT INTO nmt_fleet_manager.bookings(
        `uuid`,
        `vehicle_id`,
        `vehicle_uuid`,
        `started_at`,
        `ended_at`,
        `start_odometer`,
        `type`,
        `cost`
    )
VALUES (
        '3e933953-5b14-40b9-b04c-00c968d49d39',
        '1',
        '23c07876-a967-4cf0-bf22-0fdeaf7beb06',
        '2019-11-28',
        '2019-11-29',
        900,
        'D',
        100
    ),
    (
        'a6bd0071-77cd-46a1-a338-8c897e4108b0',
        '2',
        '37b80138-56e3-4834-9870-5c618e648d0c',
        '2019-11-28',
        '2019-11-30',
        500,
        'K',
        0
    ),
    (
        '963bc486-cc1a-4463-8cfb-98b0782f115a',
        '3',
        '3fc41603-8b8a-4207-bba4-a49095f36692',
        '2019-11-28',
        '2019-12-04',
        10000,
        'D',
        600
    ),
    (
        '71e8702f-d387-4722-80b2-f5486ef7793e',
        '4',
        '6cf6b703-c154-4e34-a79f-de9be3d10d88',
        '2019-12-05',
        '2019-12-07',
        15000,
        'K',
        0
    ),
    (
        '0113f97c-eee1-46dd-a779-04f268db536a',
        '5',
        '6f818b4c-da01-491b-aed9-5c51771051a5',
        '2019-12-13',
        '2019-12-20',
        20000,
        'D',
        700
    );
# Journeys:
INSERT INTO nmt_fleet_manager.journeys(
        uuid,
        booking_id,
        booking_uuid,
        vehicle_id,
        vehicle_uuid,
        started_at,
        ended_at,
        journey_from,
        journey_to,
        start_odometer,
        end_odometer
    )
VALUES (
        '83d2722f-baf5-4632-85a1-4cb1c02185ee',
        '1',
        '3e933953-5b14-40b9-b04c-00c968d49d39',
        '1',
        '23c07876-a967-4cf0-bf22-0fdeaf7beb06',
        '2019-11-28',
        '2019-11-29',
        'Perth',
        'Geraldton',
        900,
        1315
    ),
    (
        'ff55c6c4-7988-4197-9779-c8702520745a',
        '2',
        'a6bd0071-77cd-46a1-a338-8c897e4108b0',
        '2',
        '37b80138-56e3-4834-9870-5c618e648d0c',
        '2019-11-29',
        '2019-11-30',
        'Perth',
        'Subiaco',
        500,
        504
    ),
    (
        '2e0dfc1f-5042-4be1-9241-7febfea5dc89',
        '3',
        '963bc486-cc1a-4463-8cfb-98b0782f115a',
        '3',
        '3fc41603-8b8a-4207-bba4-a49095f36692',
        '2019-11-28',
        '2019-11-29',
        'Perth',
        'Margaret River',
        10000,
        10270
    ),
    (
        'c27dea31-25aa-4efe-8411-327e9b934144',
        '4',
        '71e8702f-d387-4722-80b2-f5486ef7793e',
        '4',
        '6cf6b703-c154-4e34-a79f-de9be3d10d88',
        '2019-12-05',
        '2019-12-06',
        'Perth',
        'Lancelin',
        15000,
        15122
    ),
    (
        '9521972a-e38d-4830-a43a-77b1868c634b',
        '5',
        '0113f97c-eee1-46dd-a779-04f268db536a',
        '5',
        '6f818b4c-da01-491b-aed9-5c51771051a5',
        '2019-12-13',
        '2019-12-13',
        'Perth',
        'Joondalup',
        20000,
        20025
    );
# Fuel Purchases
INSERT INTO nmt_fleet_manager.fuel_purchases(
        uuid,
        booking_id,
        booking_uuid,
        vehicle_id,
        vehicle_uuid,
        fuel_quantity,
        fuel_price
    )
VALUES (
        'faf91e4f-a948-41e2-b524-e267f4e8d75d',
        '1',
        '3e933953-5b14-40b9-b04c-00c968d49d39',
        '1',
        '23c07876-a967-4cf0-bf22-0fdeaf7beb06',
        60,
        1.2
    ),
    (
        '55853368-d34e-45cf-a03b-4529281d3a10',
        '2',
        'a6bd0071-77cd-46a1-a338-8c897e4108b0',
        '2',
        '37b80138-56e3-4834-9870-5c618e648d0c',
        10,
        1.3
    ),
    (
        'b62ac6b8-ad5d-4f96-825d-6658471b26d1',
        '4',
        '71e8702f-d387-4722-80b2-f5486ef7793e',
        '4',
        '6cf6b703-c154-4e34-a79f-de9be3d10d88',
        30,
        1.4
    ),
    (
        '39f06ed5-a685-4619-b20b-aeefc49e4ee7',
        '5',
        '0113f97c-eee1-46dd-a779-04f268db536a',
        '5',
        '6f818b4c-da01-491b-aed9-5c51771051a5',
        5,
        1.2
    );
# Services:
INSERT INTO nmt_fleet_manager.services(
        uuid,
        vehicle_id,
        vehicle_uuid,
        odometer,
        serviced_at
    )
VALUES (
        '67f7fcc5-e591-401c-ba5c-7eb49409fc2e',
        '1',
        '23c07876-a967-4cf0-bf22-0fdeaf7beb06',
        1400,
        '2019-12-04'
    ),
    (
        'a9d9f0af-95d2-47fd-9450-a8a8c5b6fb2e',
        '2',
        '37b80138-56e3-4834-9870-5c618e648d0c',
        600,
        '2019-12-02'
    ),
    (
        'd4307f3a-6637-45d3-8fc6-38844da4fc96',
        '3',
        '3fc41603-8b8a-4207-bba4-a49095f36692',
        10300,
        '2019-12-06'
    ),
    (
        'cae0f850-f55f-4d1b-a6d3-96bcce4fa7ec',
        '4',
        '6cf6b703-c154-4e34-a79f-de9be3d10d88',
        15200,
        '2019-12-12'
    ),
    (
        'f4a0a09c-315f-4c51-aba1-feee8f2e81cf',
        '5',
        '6f818b4c-da01-491b-aed9-5c51771051a5',
        20100,
        '2019-12-21'
    );
# STEP 4: Develop & Test Features
# Already completed (from TDD assignment)
# STEP 5: Demonstrate
# See https://github.com/diego-cc/car-rental-system/tree/mysql
# See check sheet in appendix
# STEP 6: Knowledge Questions
# See ICTPRG403-PP2-Answer-Doc.pdf