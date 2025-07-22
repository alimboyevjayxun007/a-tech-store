# ============ Build Stage ============
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npm run build 

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist



EXPOSE 4001 
CMD ["npm", "run", "start:prod"] 

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
