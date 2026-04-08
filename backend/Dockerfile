# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and prisma schema
COPY . .

# Generate Prisma Client
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Build the app
RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Install production dependencies ONLY
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy build artifacts and prisma from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Environment variables
ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Start with Prisma migration and then the app
# (Optional: Use a shell script if you need more complex startup)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
