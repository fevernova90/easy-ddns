# BUILD

FROM node:lts-bullseye AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# TARGET PRODUCTION

FROM node:lts-alpine AS production

WORKDIR /app

COPY package*.json .

ENV NODE_ENV production

RUN npm ci --only=production

COPY --from=build /app/dist ./dist/

COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD [ "node", "dist/index.js" ]