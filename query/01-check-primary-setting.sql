SHOW variables LIKE 'log_bin';

SHOW variables LIKE 'gtid_mode';

SHOW MASTER STATUS\G
-- OUT OUT
-- *************************** 1. row ***************************
--              File: binlog.000003
--          Position: 197
--      Binlog_Do_DB:
--  Binlog_Ignore_DB:
-- Executed_Gtid_Set: 7217e5d6-7c4d-11f0-970b-367efbfc4bd8:1-12
-- 1 row in set (0.00 sec)

SHOW VARIABLES LIKE 'server_uuid';