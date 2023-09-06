@echo off

set file_path=.\dump
set host=127.0.0.1
set port=5432
set username=sys

pg_restore -v -c -C -h %host% -p %port% -U %username% -W -d postgres %file_path%\#000_last_dump.tar