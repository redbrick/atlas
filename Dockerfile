FROM node:20-alpine AS build

RUN apk update && apk add git

COPY . /app/

WORKDIR /app

RUN corepack enable

RUN yarn

RUN yarn build

FROM nginx:1.29-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
