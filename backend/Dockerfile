FROM node:20

ENV NODE_VERSION 20.13.1

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

RUN npx prisma generate