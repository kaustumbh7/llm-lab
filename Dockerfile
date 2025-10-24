FROM mcr.microsoft.com/devcontainers/base:bookworm

# Install Node + PNPM
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs && \
    corepack enable && corepack prepare pnpm@latest --activate && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
