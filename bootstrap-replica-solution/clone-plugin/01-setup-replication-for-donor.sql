INSTALL PLUGIN clone SONAME 'mysql_clone.so';
CREATE USER IF NOT EXISTS 'clone_user'@'%' IDENTIFIED BY 'ClonePass!';
GRANT BACKUP_ADMIN ON *.* TO 'clone_user'@'%';
FLUSH PRIVILEGES;