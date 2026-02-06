#!/bin/bash
# AI Concierge - Auto Backup Script
# Run this via cron for automatic backups

BACKUP_DIR="backups/$(date +%Y-%m-%d)"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "📦 Auto Backup - $(date)"
echo "========================"

# Create backup directory
mkdir -p "$REPO_DIR/$BACKUP_DIR"

# Commit any uncommitted changes
cd "$REPO_DIR"

# Check for changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    git add -A
    git commit -m "backup: $TIMESTAMP" || true
    git push || echo "⚠️  Push failed (可能是网络问题)"
else
    echo "✅ No changes to commit"
fi

# Backup critical files
cp "$REPO_DIR/TODO.md" "$REPO_DIR/$BACKUP_DIR/TODO.md" 2>/dev/null || true
cp "$REPO_DIR/memory/*.md" "$REPO_DIR/$BACKUP_DIR/" 2>/dev/null || true
cp -r "$REPO_DIR/.git/refs/heads" "$REPO_DIR/$BACKUP_DIR/git-refs" 2>/dev/null || true

echo "✅ Backup complete: $BACKUP_DIR"
