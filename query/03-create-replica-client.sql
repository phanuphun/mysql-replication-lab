-- replication user สำหรับ app ที่มีสิทธิ์อ่านเท่านั้น
CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED WITH mysql_native_password BY 'apppass';
GRANT SELECT ON labdb.* TO 'appuser'@'%';
FLUSH PRIVILEGES;