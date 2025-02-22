# Stage 1: Build dependencies
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .

# Stage 2: Final image (hanya copy hasil yang dibutuhkan)
FROM oven/bun:alpine
WORKDIR /app
COPY --from=builder /app /app

CMD ["bun", "run", "start"]
