FROM node:16.13.0-alpine as build
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./package.json .
RUN npm install
COPY . .
RUN ng build

FROM nginx:alpine as runtime
COPY --from=build /app/dist/frontend /usr/share/nginx/html
#RUN rm /etc/nginx/conf.d/default.conf
#COPY ./nginx.conf /etc/nginx/conf.d
