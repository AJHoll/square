@echo off

psql -U postgres -c "CREATE ROLE square WITH INHERIT LOGIN SUPERUSER PASSWORD 'gfhjkbr';"
psql -U postgres -c "CREATE DATABASE square WITH OWNER square;"