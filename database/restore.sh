psql -c "CREATE ROLE square WITH INHERIT LOGIN SUPERUSER PASSWORD 'gfhjkbr';"
psql -c "CREATE DATABASE square WITH OWNER square;"
pg_restore -v -O -U square -d square 000_last_dump.tar