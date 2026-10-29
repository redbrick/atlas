FROM node:22.23.4-alpine3.24 AS build

RUN apk add --no-cache git

COPY . /app/

WORKDIR /app

RUN corepack enable

RUN yarn

RUN yarn build

FROM nginx:1.31.8-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
