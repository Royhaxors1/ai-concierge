#!/bin/bash
# AI Concierge Checkpoint Script
# Creates timestamped backups of critical files

TIMESTAMP=$(date +%Y%m%d_%H%M)
CHECKPOINT_DIR=".checkpoints"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "� checkpoint @ $TIMESTAMP"

# Create checkpoint directory
mkdir -p "$PROJECT_DIR/$CHECKPOINT_DIR"

# Copy critical files
cp "$PROJECT_DIR/TODO.md" "$PROJECT_DIR/$CHECKPOINT_DIR/TODO_$TIMESTAMP.md" 2>/dev/null
cp "$PROJECT_DIR/memory/*.md" "$PROJECT_DIR/$CHECKPOINT_DIR/" 2>/dev/null
cp "$PROJECT_DIR/agents/*/INBOX/*.md" "$PROJECT_DIR/$CHECKPOINT_DIR/" 2>/dev/null

# Count files backed up
COUNT=$(find "$PROJECT_DIR/$CHECKPOINT_DIR" -name "*_$TIMESTAMP.md" 2>/dev/null | wc -l)

echo "✅ Checkpoint saved: $CHECKPOINT_DIR/"
echo "   Files: $COUNT"
