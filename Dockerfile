# Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Serve
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server.js ./
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
