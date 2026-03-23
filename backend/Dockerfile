# ============================================
# CV King Backend Dockerfile
# Multi-stage build for optimized production image
# ============================================

# ---------- Base Stage ----------
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    yarn \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# ---------- Dependencies Stage ----------
FROM base AS deps

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with frozen lockfile for reproducible builds
RUN yarn install --frozen-lockfile --production=false \
    && yarn cache clean

# ---------- Builder Stage ----------
FROM deps AS builder

# Copy source code
COPY . .

# Build application
RUN yarn build

# Remove dev dependencies to reduce image size
RUN yarn install --frozen-lockfile --production=true \
    && yarn cache clean

# ---------- Production Stage ----------
FROM base AS runner

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/yarn.lock ./yarn.lock
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Expose port
EXPOSE 3001

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["yarn", "start:prod"]
