-- Database setup for Douba Backend
-- Run this script in MySQL to set up the database

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS douba_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE douba_db;

-- Grant privileges to root user (adjust as needed)
GRANT ALL PRIVILEGES ON douba_db.* TO 'root'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Display success message
SELECT 'Database douba_db created successfully!' AS message; 