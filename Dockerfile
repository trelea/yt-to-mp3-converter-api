FROM node:22-alpine AS base

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Dependencies stage - production only
FROM base AS deps
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Build stage - all dependencies needed for build
FROM base AS build
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Production stage
FROM node:22-alpine AS production

# Install dumb-init, ffmpeg (includes ffprobe), and yt-dlp
RUN apk add --no-cache dumb-init ffmpeg yt-dlp

# Create non-root user and group BEFORE using them
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

# Set working directory
WORKDIR /usr/src/app

# Copy production dependencies with proper ownership
COPY --from=deps --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules

# Copy built application with proper ownership
COPY --from=build --chown=nestjs:nodejs /usr/src/app/dist ./dist

# Copy package.json for metadata
COPY --chown=nestjs:nodejs package*.json ./

# Create logs directory with proper permissions
RUN mkdir -p logs && chown -R nestjs:nodejs logs

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Use dumb-init for proper signal handling and start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["yarn", "start:prod"]