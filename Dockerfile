# Stage 1: Build dependencies
FROM oven/bun:alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy source code (sesuai struktur)
COPY command ./command
COPY events ./events
COPY helper ./helper
COPY utils ./utils
COPY slash ./slash
COPY index.js ./
COPY server.js ./

# Stage 2: Final image
FROM oven/bun:alpine AS runner
WORKDIR /app

# Copy only necessary files
COPY --from=builder /app/package.json .
COPY --from=builder /app/bun.lock .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/command ./command
COPY --from=builder /app/events ./events
COPY --from=builder /app/helper ./helper
COPY --from=builder /app/utils ./utils
COPY --from=builder /app/slash ./slash
COPY --from=builder /app/index.js .
COPY --from=builder /app/server.js .

# Set non-root user
USER bun

# Start the bot
CMD ["bun", "run", "start"]