-- Lock สิทธิ์การเข้าถึงทั้งหมดให้เหลือแค่อ่านอย่างเดียว
SET PERSIST read_only = ON;
SET PERSIST super_read_only = ON;
SELECT @@read_only, @@super_read_only;