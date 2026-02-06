#!/bin/bash
# AI Concierge - Quick Setup Script
# Run this on your laptop to clone and set up the project

set -e

echo "🤖 AI Concierge Setup"
echo "===================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to project directory
cd "$(dirname "$0")"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    echo "Install git from: https://git-scm.com/downloads"
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: node is not installed${NC}"
    echo "Install Node.js from: https://nodejs.org/downloads"
    exit 1
fi

echo -e "${GREEN}[1/5]${NC} Cloning repository..."
if [ -d "ai-concierge" ]; then
    echo "Directory 'ai-concierge' exists. Pulling latest changes..."
    cd ai-concierge
    git pull
else
    git clone https://github.com/Royhaxors1/ai-concierge.git
    cd ai-concierge
fi

echo -e "${GREEN}[2/5]${NC} Installing dependencies..."
npm ci

echo -e "${GREEN}[3/5]${NC} Setting up environment variables..."
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env.local with your values!${NC}"
    echo ""
    echo "Required environment variables:"
    echo "  - DATABASE_URL (Supabase PostgreSQL)"
    echo "  - GOOGLE_CLIENT_ID"
    echo "  - GOOGLE_CLIENT_SECRET"
    echo "  - INNGEST_EVENT_KEY"
    echo "  - INNGEST_SIGNING_KEY"
    echo ""
    echo "Optional:"
    echo "  - OPENCLAW_GATEWAY_URL"
    echo ""
    echo "Edit .env.local now? (y/n)"
    read -r edit
    if [ "$edit" = "y" ] || [ "$edit" = "Y" ]; then
        if command -v nano &> /dev/null; then
            nano .env.local
        elif command -v code &> /dev/null; then
            code .env.local
        else
            echo "Open .env.local in your editor manually"
        fi
    fi
else
    echo ".env.local already exists, skipping..."
fi

echo -e "${GREEN}[4/5]${NC} Setting up database..."
if [ -f ".env.local" ]; then
    cd app
    npx prisma generate
    npx prisma db push
    cd ..
fi

echo -e "${GREEN}[5/5]${NC} Done!"
echo ""
echo "========================================"
echo -e "${GREEN}🚀 Project set up successfully!${NC}"
echo "========================================"
echo ""
echo "To start the development server:"
echo "  cd ai-concierge/app"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Git commands:"
echo "  git status          → See changes"
echo "  git add .           → Stage changes"
echo "  git commit -m 'msg' → Commit"
echo "  git push           → Push to GitHub"
echo ""
