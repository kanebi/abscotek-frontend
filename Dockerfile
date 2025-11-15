# Stage 1: Build the application
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and lock files
COPY package.json bun.lock* ./

# Install dependencies using bun
RUN npm install -g bun
RUN bun install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Serve the application with Caddy
FROM caddy:2-alpine

# Set the working directory
WORKDIR /app

# Copy the Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Copy the built assets from the build stage
COPY --from=build /app/dist /app

# Copy the config generation script
COPY generate-config.sh /generate-config.sh
RUN chmod +x /generate-config.sh

# Expose the port Caddy listens on
EXPOSE 8080

# Generate config and start Caddy
CMD ["/bin/sh", "-c", "/generate-config.sh && caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]
