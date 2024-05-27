FROM postgres:latest as build

WORKDIR /docker-entrypoint-initdb.d

COPY ./dump/000_last_dump.tar .
COPY ./restore.sh .