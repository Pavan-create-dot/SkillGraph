# ─── Build Stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production=false

# Copy source code
COPY tsconfig.json ./
COPY src ./src/

# Generate Prisma client
RUN npm run prisma:generate

# Compile TypeScript
RUN npm run build

# ─── Production Stage ─────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Add dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S skillgraph -u 1001

# Copy production dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force

# Generate Prisma client in production image
RUN npx prisma generate

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Set permissions
RUN chown -R skillgraph:nodejs /app

USER skillgraph

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
