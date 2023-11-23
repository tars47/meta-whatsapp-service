FROM node:16.17.0-bullseye-slim AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:16.17.0-bullseye-slim AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY ./certificates  ./certificates
COPY package*.json ./
COPY .env ./
ENV NODE_ENV=production
RUN npm ci --omit=dev
CMD ["node", "dist/Server.js"]