CREATE DATABASE IF NOT EXISTS labdb;
USE labdb;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- user สำหรับ app
CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED WITH mysql_native_password BY 'apppass';
GRANT SELECT, INSERT, UPDATE, DELETE ON labdb.* TO 'appuser'@'%';

-- สร้าง user สำหรับให้ client ที่ทำ replication เท่านั้น
CREATE USER IF NOT EXISTS 'replica'@'%' IDENTIFIED WITH mysql_native_password BY 'replpass';
GRANT REPLICATION SLAVE , REPLICATION CLIENT ON *.* TO 'replica'@'%';
FLUSH PRIVILEGES;