# ============ Build Stage ============
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ============ Production Stage ============
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Environment variables (GitHub Secretsdan build-arg orqali keladi)
ARG PORT=4001
ARG MONGO_URI
ARG JWT_SECRET
ARG JWT_REFRESH_SECRET
ARG MAIL_HOST
ARG MAIL_PORT
ARG MAIL_USER
ARG MAIL_PASS
ARG MAIL_FROM

ENV PORT=$PORT
ENV MONGO_URI=$MONGO_URI
ENV JWT_SECRET=$JWT_SECRET
ENV JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
ENV MAIL_HOST=$MAIL_HOST
ENV MAIL_PORT=$MAIL_PORT
ENV MAIL_USER=$MAIL_USER
ENV MAIL_PASS=$MAIL_PASS
ENV MAIL_FROM="$MAIL_FROM"

EXPOSE $PORT
CMD ["npm", "run", "start:prod"]