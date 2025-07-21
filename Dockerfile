# ============ Build Stage ============
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci # Yoki agar siz yarn ishlatayotgan bo'lsangiz: yarn install
COPY . .
RUN npm run build # Yoki agar siz yarn ishlatayotgan bo'lsangiz: yarn build

# ============ Production Stage ============
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Muhit o'zgaruvchilari bu yerda o'rnatilmaydi.
# Ular konteyner ishga tushirilganda docker-compose.yml orqali .env faylidan beriladi.

EXPOSE 4001 
CMD ["npm", "run", "start:prod"] 