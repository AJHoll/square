psql -c "CREATE ROLE square WITH INHERIT LOGIN SUPERUSER PASSWORD 'gfhjkbr';"
psql -c "CREATE DATABASE IF NOT EXISTS square WITH OWNER square;"