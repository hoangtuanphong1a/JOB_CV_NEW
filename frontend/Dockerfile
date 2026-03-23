# ============================================
# CV King Frontend Dockerfile
# Multi-stage build for optimized Next.js production image
# ============================================

# ---------- Base Stage ----------
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Enable pnpm
RUN corepack enable pnpm

# Create app directory
WORKDIR /app

# ---------- Dependencies Stage ----------
FROM base AS deps

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile for reproducible builds
RUN pnpm install --frozen-lockfile --prod=false

# ---------- Builder Stage ----------
FROM deps AS builder

# Copy source code
COPY . .

# Copy environment file for build (if needed)
# COPY .env.production .env.production

# Build application
RUN pnpm build

# ---------- Production Stage ----------
FROM base AS runner

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile \
    && pnpm store prune

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Expose port
EXPOSE 3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["pnpm", "start"]
