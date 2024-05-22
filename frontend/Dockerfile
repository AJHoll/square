FROM node:20 as build
ENV NODE_VERSION 20.13.1

WORKDIR /usr/src/app

COPY . .
COPY ./config-prod.json ./public/config.json

RUN npm install

RUN npm run build

FROM nginx:stable

COPY --from=build /usr/src/app/build /usr/share/nginx/html
#COPY --from=build /usr/src/app/nginx/default.conf /etc/nginx/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]