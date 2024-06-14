@echo off

set file_path=.\dump
set host=127.0.0.1
set port=5432
set username=postgres

psql -U postgres -c "CREATE ROLE square WITH INHERIT LOGIN SUPERUSER PASSWORD 'gfhjkbr';"
psql -U postgres -c "CREATE DATABASE square WITH OWNER square;"
pg_restore -v -c -O -C -h %host% -p %port% -U %username% -W -d postgres %file_path%\000_last_dump.tar