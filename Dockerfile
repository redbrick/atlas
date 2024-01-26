FROM node:18.19.0-alpine AS build

RUN apk update && apk add git

USER node
WORKDIR /app
COPY ./package.json ./
RUN yarn config set network-timeout 600000 -g

RUN yarn && yarn cache clean

COPY . .
RUN yarn build

FROM nginx:1.24.0-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]