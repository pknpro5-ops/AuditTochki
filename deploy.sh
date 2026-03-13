#!/bin/bash
# Deploy script for AuditTochki on Beget VPS
# Run on VPS: bash deploy.sh

set -e

APP_DIR="/opt/audittochki"
REPO="https://github.com/pknpro5-ops/AuditTochki.git"
BRANCH="master"

echo "=== AuditTochki Deploy ==="

# Pull latest code
if [ -d "$APP_DIR" ]; then
  echo "→ Pulling latest changes..."
  cd "$APP_DIR"
  git fetch origin
  git reset --hard origin/$BRANCH
else
  echo "→ Cloning repository..."
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# Install dependencies
echo "→ Installing dependencies..."
npm ci --production=false

# Generate Prisma client
echo "→ Generating Prisma client..."
npx prisma generate

# Run migrations
echo "→ Running database migrations..."
npx prisma db push

# Build Next.js
echo "→ Building Next.js..."
npm run build

# Restart service
echo "→ Restarting service..."
sudo systemctl restart audittochki

echo "=== Deploy complete ==="
