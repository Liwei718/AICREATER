FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build:fast

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
ENV DATA_DIR=/app/.data

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/server ./server

EXPOSE 3001

CMD ["npm", "run", "start:server"]