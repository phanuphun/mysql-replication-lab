-- INSTALL PLUGIN
INSTALL PLUGIN clone SONAME 'mysql_clone.so';

--  ALLOW RECIPIANT KNOW REPLICA 1 (DONOR) 
SET GLOBAL clone_valid_donor_list = 'mysql-replica:3306';
-- OR
SET PERSIST clone_valid_donor_list = 'mysql-replica:3306'; 

-- CHECK
SELECT @@GLOBAL.clone_valid_donor_list;

-- CHECK PLUGIN
  SELECT PLUGIN_NAME, PLUGIN_STATUS
  FROM INFORMATION_SCHEMA.PLUGINS
  WHERE PLUGIN_NAME='clone';