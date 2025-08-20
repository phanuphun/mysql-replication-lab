# READ ME
This repository is a lab workshop to practice MySQL Replication by using `Node.js` , `Express` to create Restful API for testing and used `mysql2` for query to database 
- `config` directory is a config file for db to reference setting in database.

## Setup and Installation
- run `docker-compose up -d` to start db server.
- setup primary and replica db server following `basic-setup-replication`
- create `.env` file and setup env vriables. 
```
# Primary (writer)
DB_WRITE_HOST=
DB_WRITE_PORT=
DB_USER=
DB_PASS=
DB_NAME=

# Replica (reader)
DB_READ_HOST=
DB_READ_PORT=

# Replica 2 (reader)
DB_READ_HOST_NEW=
DB_READ_PORT_NEW=

PORT=
```

## Clone Relica (Donor -> Reciptiant)
i try to test how i can sync data from old replica to new replica that i have must be the same data by using `mysql_clone.so` plugin (since `MySQL 8.0.17`)
- `./bootstrap-replica-solution./clone/` directory have a SQL file step to step that i used
- in docker compose `mysql-replica-2` using for test mysql cloning.